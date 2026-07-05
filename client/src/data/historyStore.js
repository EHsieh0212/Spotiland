/*
 * historyStore.js — persistence for imported Spotify streaming history.
 *
 * Raw play records are large (~100MB+ across a full export), so they live in
 * IndexedDB rather than localStorage. Each Streaming_History_Audio_*.json file
 * is stored as its own record, keyed by filename. This is what makes the
 * "upload several zips, newest wins" rule cheap: a newer export re-uses the same
 * filenames, so importing it simply overwrites the matching entries.
 *
 * Store shape (object store "files", keyPath "filename"):
 *   { filename: string, date: string (ISO), records: object[] }
 * `date` is the zip entry's last-modified time — used so a *newer* file always
 * wins even if the user drops an older export in after a newer one.
 */

const DB_NAME = 'spotiland';
const DB_VERSION = 1;
const STORE = 'files';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'filename' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

// All stored files, in no particular order.
export async function getFiles() {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const req = tx(db, 'readonly').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

// True once at least one file has been imported (drives demo-vs-imported UI).
export async function hasImportedData() {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const req = tx(db, 'readonly').count();
      req.onsuccess = () => resolve(req.result > 0);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

/**
 * Merge incoming files into the store. For each filename we keep whichever
 * version is newer (by `date`), so re-importing an older export never clobbers
 * fresher data. Returns a summary of what changed.
 *
 * @param {Array<{filename: string, date: string, records: object[]}>} files
 */
export async function putFiles(files) {
  // Collapse duplicate filenames within this batch first (e.g. two zips that
  // both carry Streaming_History_Audio_2024.json) — newest date wins. This also
  // avoids racing concurrent writes to the same key inside one transaction.
  const byName = new Map();
  for (const file of files) {
    const prev = byName.get(file.filename);
    if (!prev || (file.date || '') >= (prev.date || '')) byName.set(file.filename, file);
  }
  const deduped = [...byName.values()];

  const db = await openDb();
  try {
    const store = tx(db, 'readwrite');
    let added = 0;
    let replaced = 0;
    let skipped = 0;

    await Promise.all(
      deduped.map(
        (file) =>
          new Promise((resolve, reject) => {
            const getReq = store.get(file.filename);
            getReq.onsuccess = () => {
              const existing = getReq.result;
              if (!existing) {
                added += 1;
              } else if ((file.date || '') >= (existing.date || '')) {
                replaced += 1;
              } else {
                skipped += 1; // incoming is older than what we already have
                resolve();
                return;
              }
              const putReq = store.put(file);
              putReq.onsuccess = () => resolve();
              putReq.onerror = () => reject(putReq.error);
            };
            getReq.onerror = () => reject(getReq.error);
          })
      )
    );

    return { added, replaced, skipped };
  } finally {
    db.close();
  }
}

// Wipe every imported file (dashboard falls back to the bundled demo data).
export async function clearFiles() {
  const db = await openDb();
  try {
    await new Promise((resolve, reject) => {
      const req = tx(db, 'readwrite').clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

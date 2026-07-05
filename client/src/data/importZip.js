/*
 * importZip.js — pull the Extended Streaming History out of a Spotify export zip.
 *
 * The user downloads "Spotify Account Data.zip" (or the smaller extended-history
 * zip) from the email Spotify sends. Inside is a folder
 *   "Spotify Extended Streaming History/"
 * holding one JSON per year: Streaming_History_Audio_<year>[_n].json.
 * We unzip in the browser with JSZip, keep only the audio history, and strip
 * each record down to the handful of fields aggregate.js actually reads.
 */
import JSZip from 'jszip';

// Only these fields are used downstream — dropping the rest keeps IndexedDB small.
const slimRecord = (r) => ({
  ts: r.ts,
  ms_played: r.ms_played,
  master_metadata_album_artist_name: r.master_metadata_album_artist_name,
  master_metadata_track_name: r.master_metadata_track_name,
  spotify_track_uri: r.spotify_track_uri,
});

// Match audio history files anywhere in the zip tree, regardless of the parent
// folder name. Video history and the readme PDF are ignored.
const AUDIO_RE = /(^|\/)Streaming_History_Audio_[^/]*\.json$/i;

// Zip path -> just the file name, our override key across different exports.
const baseName = (p) => p.split('/').pop();

/**
 * Extract the streaming-history files from one zip.
 * @param {File|Blob} zipFile
 * @returns {Promise<Array<{filename: string, date: string, records: object[]}>>}
 * @throws if the zip is unreadable or contains no audio history.
 */
export async function extractHistoryFromZip(zipFile) {
  let zip;
  try {
    zip = await JSZip.loadAsync(zipFile);
  } catch (e) {
    throw new Error(`"${zipFile.name}" doesn't look like a valid .zip file.`);
  }

  const entries = zip.file(AUDIO_RE); // JSZip supports RegExp matching
  if (!entries.length) {
    throw new Error(
      `No Extended Streaming History found in "${zipFile.name}". ` +
        `Make sure it's the Spotify export zip that contains the ` +
        `"Spotify Extended Streaming History" folder.`
    );
  }

  const files = [];
  for (const entry of entries) {
    const text = await entry.async('string');
    let records;
    try {
      records = JSON.parse(text);
    } catch (e) {
      throw new Error(`Couldn't parse ${baseName(entry.name)} — the file may be corrupted.`);
    }
    if (!Array.isArray(records)) continue;
    files.push({
      filename: baseName(entry.name),
      // zip entry's last-modified time — lets a newer export win on override.
      date: entry.date ? entry.date.toISOString() : '',
      records: records.map(slimRecord),
    });
  }

  return files;
}

/**
 * Extract several zips in order. Errors on individual zips are collected rather
 * than aborting the whole batch. Later zips naturally override earlier ones once
 * persisted, because override is keyed by filename + date.
 * @param {Array<File>} zipFiles
 * @returns {Promise<{files: object[], errors: string[]}>}
 */
export async function extractHistoryFromZips(zipFiles) {
  const files = [];
  const errors = [];
  for (const zipFile of zipFiles) {
    try {
      const extracted = await extractHistoryFromZip(zipFile);
      files.push(...extracted);
    } catch (e) {
      errors.push(e.message);
    }
  }
  return { files, errors };
}

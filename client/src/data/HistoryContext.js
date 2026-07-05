/*
 * HistoryContext — the single source of the aggregated streaming history the
 * dashboard renders. It decides between two sources:
 *
 *   • "imported" — the user dropped Spotify export zip(s) on the Import page;
 *     records live in IndexedDB and we aggregate them in the browser.
 *   • "demo"     — nothing imported yet, so we fall back to the committed
 *     streamingHistory.json that ships with the app.
 *
 * Components read `useHistory()` instead of importing the JSON directly, so they
 * automatically re-render when an import replaces the data.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import demoHistory from './streamingHistory.json';
import { aggregate } from './aggregate';
import { getFiles, putFiles, clearFiles } from './historyStore';
import { extractHistoryFromZips } from './importZip';

const HistoryContext = createContext(null);

// Build the aggregated summary from whatever is in IndexedDB, or fall back to
// the bundled demo dataset when nothing has been imported.
async function loadHistory() {
  const files = await getFiles();
  if (files.length) {
    return { history: aggregate(files.map((f) => f.records)), source: 'imported' };
  }
  return { history: demoHistory, source: 'demo' };
}

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(demoHistory);
  const [source, setSource] = useState('demo'); // 'demo' | 'imported'
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'importing'

  // On first mount, hydrate from IndexedDB (may override the demo default).
  useEffect(() => {
    let alive = true;
    loadHistory()
      .then(({ history, source }) => {
        if (!alive) return;
        setHistory(history);
        setSource(source);
      })
      .catch((e) => console.error('Failed to load imported history:', e))
      .finally(() => alive && setStatus('ready'));
    return () => {
      alive = false;
    };
  }, []);

  /**
   * Import one or more Spotify export zips: unzip → persist (newest wins) →
   * re-aggregate everything stored → swap the dashboard over to it.
   * @param {FileList|File[]} fileList
   * @returns {Promise<{ok: boolean, added: number, replaced: number, skipped: number, errors: string[], totals?: object}>}
   */
  const importZips = useCallback(async (fileList) => {
    const zips = [...fileList].filter((f) => /\.zip$/i.test(f.name));
    if (!zips.length) {
      return { ok: false, added: 0, replaced: 0, skipped: 0, errors: ['Please drop a .zip file.'] };
    }

    setStatus('importing');
    try {
      const { files, errors } = await extractHistoryFromZips(zips);
      if (!files.length) {
        return { ok: false, added: 0, replaced: 0, skipped: 0, errors };
      }
      const merged = await putFiles(files);
      const { history, source } = await loadHistory();
      setHistory(history);
      setSource(source);
      return { ok: true, ...merged, errors, totals: history.totals };
    } finally {
      setStatus('ready');
    }
  }, []);

  // Forget all imported data and return to the bundled demo dataset.
  const reset = useCallback(async () => {
    setStatus('importing');
    try {
      await clearFiles();
      setHistory(demoHistory);
      setSource('demo');
    } finally {
      setStatus('ready');
    }
  }, []);

  return (
    <HistoryContext.Provider value={{ history, source, status, importZips, reset }}>
      {children}
    </HistoryContext.Provider>
  );
}

// The aggregated summary ({ generatedAt, totals, monthly }).
export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within a HistoryProvider');
  return ctx.history;
}

// Full context — for the Import page (source flag, status, import/reset actions).
export function useHistoryContext() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistoryContext must be used within a HistoryProvider');
  return ctx;
}

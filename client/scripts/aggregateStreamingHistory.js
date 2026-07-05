/*
 * aggregateStreamingHistory.js
 *
 * One-off build step that turns the raw Spotify "Extended Streaming History"
 * export (~200k play records across 19 JSON files, ~180MB) into a tiny summary
 * JSON the React app can import directly.
 *
 * Run from the client/ folder:
 *   node scripts/aggregateStreamingHistory.js
 *
 * Output: src/data/streamingHistory.json
 *
 * Three views are produced:
 *   - monthly: per year x month listening totals PLUS a 24-slot hour-of-day
 *     profile (average minutes listened in each hour, per active day of that
 *     month) AND the top singers / top tracks (by play count) of that month —
 *     this drives the radial "listening clock" and the monthly Top lists.
 */
const fs = require('fs');
const path = require('path');

// The history export sits at the repo root, one level above client/.
const HISTORY_DIR = path.join(__dirname, '..', '..', 'Spotify Extended Streaming History');
const OUT_DIR = path.join(__dirname, '..', 'src', 'data');
const OUT_FILE = path.join(OUT_DIR, 'streamingHistory.json');

// Taiwan has no DST, so a fixed +8h offset is exact for local wall-clock time.
const TW_OFFSET_MS = 8 * 60 * 60 * 1000;

const TOP_N = 10; // how many singers / tracks to keep per month / year

// Spotify track id lives in the uri "spotify:track:<id>".
const trackIdFromUri = (uri) => uri.split(':')[2];

// name -> plays  ==> sorted top-N singers
const topSingersFrom = (artistPlays) =>
  Object.entries(artistPlays)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N)
    .map(([name, plays]) => ({ name, plays }));

// uri -> { name, artist, plays }  ==> sorted top-N tracks (id kept for artwork)
const topTracksFrom = (trackPlays) =>
  Object.entries(trackPlays)
    .sort((a, b) => b[1].plays - a[1].plays)
    .slice(0, TOP_N)
    .map(([uri, t]) => ({ id: trackIdFromUri(uri), name: t.name, artist: t.artist, plays: t.plays }));

function main() {
  const files = fs
    .readdirSync(HISTORY_DIR)
    .filter((f) => f.startsWith('Streaming_History_Audio_') && f.endsWith('.json'));

  // year -> [12 months] of { plays, ms }, filled lazily as years appear.
  const monthsByYear = {};

  let totalPlays = 0;
  let totalMs = 0;

  for (const file of files) {
    const records = JSON.parse(fs.readFileSync(path.join(HISTORY_DIR, file), 'utf8'));
    for (const r of records) {
      const local = new Date(new Date(r.ts).getTime() + TW_OFFSET_MS);
      // getUTC* on the shifted date === local TW wall clock.
      const year = local.getUTCFullYear();
      const month = local.getUTCMonth(); // 0 = Jan ... 11 = Dec
      const hour = local.getUTCHours(); // 0 ... 23, local wall clock
      const localDate = local.toISOString().slice(0, 10); // local YYYY-MM-DD
      if (!monthsByYear[year]) {
        monthsByYear[year] = Array.from({ length: 12 }, () => ({
          plays: 0,
          ms: 0,
          hourMs: new Array(24).fill(0),
          days: new Set(),
          artistPlays: {},           // name -> play count
          trackPlays: {},            // track uri -> { name, artist, plays }
        }));
      }
      const cell = monthsByYear[year][month];
      cell.plays += 1;
      cell.ms += r.ms_played;
      cell.hourMs[hour] += r.ms_played;
      cell.days.add(localDate);

      // top-list tallies (skip podcast/local rows with no track metadata)
      const artist = r.master_metadata_album_artist_name;
      const trackName = r.master_metadata_track_name;
      const uri = r.spotify_track_uri;
      if (artist) cell.artistPlays[artist] = (cell.artistPlays[artist] || 0) + 1;
      if (uri && trackName) {
        if (!cell.trackPlays[uri]) cell.trackPlays[uri] = { name: trackName, artist, plays: 0 };
        cell.trackPlays[uri].plays += 1;
      }

      totalPlays += 1;
      totalMs += r.ms_played;
    }
  }

  // Emit one row per year (ascending), each row a 12-month array of
  // { plays, hours } so the UI can heat-map either metric.
  const years = Object.keys(monthsByYear)
    .map(Number)
    .sort((a, b) => a - b);
  const monthly = years.map((year) => {
    // whole-year tallies, merged from every month of the year
    const yearArtist = {};
    const yearTrack = {};

    const months = monthsByYear[year].map((m) => {
      // fold this month into the year totals
      for (const [name, plays] of Object.entries(m.artistPlays)) {
        yearArtist[name] = (yearArtist[name] || 0) + plays;
      }
      for (const [uri, t] of Object.entries(m.trackPlays)) {
        if (!yearTrack[uri]) yearTrack[uri] = { name: t.name, artist: t.artist, plays: 0 };
        yearTrack[uri].plays += t.plays;
      }
      return {
        plays: m.plays,
        // total listening hours this month
        hours: Math.round((m.ms / 3600000) * 10) / 10,
        // distinct calendar days this month that had any listening
        activeDays: m.days.size,
        // total minutes listened in each hour-of-day (raw totals; the UI divides
        // by the month's day count to get an average-per-day figure)
        hourMinutes: m.hourMs.map((ms) => Math.round((ms / 60000) * 10) / 10),
        topSingers: topSingersFrom(m.artistPlays),
        topTracks: topTracksFrom(m.trackPlays),
      };
    });

    return {
      year,
      // whole-year top lists (drive the "All" locomotive)
      topSingers: topSingersFrom(yearArtist),
      topTracks: topTracksFrom(yearTrack),
      months,
    };
  });

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    totals: {
      plays: totalPlays,
      hours: Math.round(totalMs / 3600000),
    },
    monthly,
  };

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUT_FILE}`);
  console.log(`  ${totalPlays} plays, ${out.totals.hours} hrs`);
}

main();

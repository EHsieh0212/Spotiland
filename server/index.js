require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = process.env.REDIRECT_URI || 'http://127.0.0.1:8000/callback';
let FRONTEND_URI = process.env.FRONTEND_URI || 'http://127.0.0.1:3000';
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  REDIRECT_URI = 'http://127.0.0.1:8000/callback';
  FRONTEND_URI = 'http://127.0.0.1:3000';
}

const express = require('express');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');
const history = require('connect-history-api-fallback');
const {generateRandomString} = require('./utils/utils')


const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

app
  .use(express.static(path.resolve(__dirname, '../client/build')))
  .use(cors())
  .use(cookieParser())
  .use(
    history({
      verbose: true,
      rewrites: [
        { from: /\/login/, to: '/login' },
        { from: /\/callback/, to: '/callback' },
        { from: /\/refresh_token/, to: '/refresh_token' },
        // keep API calls as-is; never rewrite them to index.html
        { from: /^\/api\/.*$/, to: context => context.parsedUrl.pathname + (context.parsedUrl.search || '') },
      ],
    }),
  )
  .use(express.static(path.resolve(__dirname, '../client/build')));


app.get('/', function (req, res) {
  res.render(path.resolve(__dirname, '../client/build/index.html'));
});

app.get('/login', function (req, res) {
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state);

  // your application requests authorization
  const scope =
    'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public';

  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
    })}`,
  );
});

// Basic auth header shared by the token requests below.
const basicAuthHeader = () =>
  `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;

app.get('/callback', async function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${querystring.stringify({ error: 'state_mismatch' })}`);
    return;
  }

  res.clearCookie('spotify_auth_state');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthHeader(),
      },
      body: new URLSearchParams({
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`);
      return;
    }

    const body = await response.json();

    // we can also pass the token to the browser to make requests from there
    res.redirect(
      `${FRONTEND_URI}/#${querystring.stringify({
        access_token: body.access_token,
        refresh_token: body.refresh_token,
      })}`,
    );
  } catch (error) {
    console.error(error);
    res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`);
  }
});

app.get('/refresh_token', async function (req, res) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthHeader(),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });

    if (!response.ok) {
      res.status(response.status).send({ error: 'could_not_refresh_token' });
      return;
    }

    const body = await response.json();
    res.send({ access_token: body.access_token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'could_not_refresh_token' });
  }
});

// ---------------------------------------------------------------------------
// App-level enrichment (Client Credentials).
//
// Album art and artist photos are *public* catalogue data, not tied to any one
// user. Serving them from an app-level token means anyone who imports their own
// streaming history gets full artwork without logging into Spotify (and without
// counting against the app's 25-user development-mode allowlist).
// ---------------------------------------------------------------------------

// Cache the Client Credentials token until shortly before it expires, so we're
// not minting a fresh one on every request.
let appToken = null;
let appTokenExpiry = 0;

async function getAppToken() {
  if (appToken && Date.now() < appTokenExpiry) return appToken;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: basicAuthHeader(),
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!response.ok) throw new Error(`client_credentials token failed: ${response.status}`);

  const body = await response.json();
  appToken = body.access_token;
  // refresh a minute early so a token never expires mid-flight
  appTokenExpiry = Date.now() + (body.expires_in - 60) * 1000;
  return appToken;
}

// Proxy a Spotify Web API GET with the app token, forwarding its JSON verbatim
// (so the frontend consumes the exact same shape as a direct Spotify call).
async function spotifyGet(res, url) {
  try {
    const token = await getAppToken();
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const body = await response.json();
    res.status(response.status).send(body);
  } catch (error) {
    console.error('enrichment failed:', error);
    res.status(502).send({ error: 'enrichment_failed' });
  }
}

// Album art for a batch of track ids (comma-separated, max 50).
app.get('/api/enrich/tracks', function (req, res) {
  const ids = (req.query.ids || '').trim();
  if (!ids) {
    res.status(400).send({ error: 'missing_ids' });
    return;
  }
  spotifyGet(res, `https://api.spotify.com/v1/tracks?ids=${encodeURIComponent(ids)}`);
});

// Best-match artist search by name (→ photo, genres, id).
app.get('/api/enrich/artist', function (req, res) {
  const name = (req.query.name || '').trim();
  if (!name) {
    res.status(400).send({ error: 'missing_name' });
    return;
  }
  spotifyGet(res, `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=6`);
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});

app.listen(PORT, function () {
  console.warn(`Spotiland listening on port ${PORT}`);
});

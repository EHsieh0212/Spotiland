# Spotiland

Log in with your Spotify account and explore your own listening profile:
your top artists and top tracks, with per-artist detail cards.

![til](demo.gif)
## 1. Purpose

Spotiland turns your personal Spotify data into a simple, visual dashboard.
After authorizing with Spotify, it reads your profile and listening history
through the Spotify Web API and presents it as a single-page dashboard.

## 2. Features

- **Spotify login** — OAuth 2.0 Authorization Code flow; token auto-refresh.
- **Profile header** — avatar, display name, and a link to your Spotify profile.
- **Top Artists** — your most-listened artists, switchable between
  **All Time** and **Last Month**. Click an artist to open a detail card
  (popularity, follower count, genres).
- **Top Tracks** — your most-listened tracks with album art, artist, and rank.

### Deprecated / disabled features

Spotify deprecated several Web API endpoints on **2024-11-27** (audio features,
audio analysis, recommendations). They now return `403` for apps without
pre-existing extended access, so the following are intentionally disabled in code:

- Track-detail popup (audio features / analysis)
- "How happy are your favorite songs?" analysis
- Recommendations & lyric generator

The core dashboard (profile, top artists, top tracks) is unaffected.

## 3. Architecture

A small two-part app: an Express backend that only handles the OAuth handshake,
and a React (CRA) frontend that talks to the Spotify Web API directly.

```
Spotiland/
├─ server/                 Express backend — OAuth only
│  └─ index.js             /login, /callback, /refresh_token (+ serves build in prod)
├─ client/                 React app (Create React App)
│  └─ src/
│     ├─ components/        Dashboard, TopSingers, TopTracks, popups, ...
│     └─ spotify/           Spotify Web API wrapper + token management
├─ .nvmrc                  Node version (22)
└─ Procfile                web: npm run start-server   (Heroku-style deploy)
```

**Tech stack**

- Backend: Node 18+ (22 recommended), Express, cors, cookie-parser, dotenv
- Frontend: React 18, react-scripts 5, styled-components, MUI, chart.js, axios

**Auth & data flow**

```
Browser ──(1) click "Log in" ──▶  GET /login              (backend :8000)
        ◀─(2) 302 redirect ─────  https://accounts.spotify.com/authorize
  user consents on Spotify
Spotify ──(3) redirect w/ code ─▶  GET /callback           (backend :8000)
        backend exchanges code → tokens via fetch()
        ◀─(4) redirect w/ tokens  http://127.0.0.1:3000/#access_token&refresh_token
Frontend stores tokens in localStorage
Frontend ──(5) Bearer token ────▶  https://api.spotify.com/v1/...   (direct)
```

The frontend calls Spotify directly; the backend only mints/refreshes tokens.
In dev, CRA proxies relative requests (e.g. `/refresh_token`) to the backend.

## 4. Local development

### Prerequisites

- **Node 22** (`nvm use` reads `.nvmrc`)
- **Yarn**
- A **Spotify app** (see below)

### Spotify app setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) → **Create app**.
2. Enable **Web API**.
3. Add Redirect URI **exactly**: `http://127.0.0.1:8000/callback`
   (Spotify rejects `http://localhost` for newly created apps.)
4. Copy the **Client ID** and **Client Secret**.

> Note: development-mode apps require the app owner to hold a Spotify **Premium**
> subscription (Spotify policy, effective 2026-02).

### Environment

Create a `.env` file in the repo root:

```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
PORT=8000
```

### Install & run

```bash
nvm use                 # Node 22
npm install             # installs backend deps and (via the install script) client deps

yarn dev                # starts backend (:8000) + frontend (:3000) together
# or run them separately:
#   yarn server         # backend  → http://127.0.0.1:8000
#   yarn client         # frontend → http://127.0.0.1:3000
```

Open **http://127.0.0.1:3000** and click **Log in to Spotify**.

### Scripts

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `yarn dev`      | Run backend + frontend concurrently |
| `yarn server`   | Run the Express backend (port 8000) |
| `yarn client`   | Run the CRA dev server (port 3000)  |
| `npm run build` | Build the client for production     |

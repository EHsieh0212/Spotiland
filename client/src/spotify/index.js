import axios from 'axios';
import { getHashParams } from '../utils';

// variables setting
const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

// set functions (已有token)
const setTokenTimestamp = () => window.localStorage.setItem('spotify_token_timestamp', Date.now());
const setLocalAccessToken = token => {
  setTokenTimestamp();
  window.localStorage.setItem('spotify_access_token', token);
};
const setLocalRefreshToken = token => window.localStorage.setItem('spotify_refresh_token', token);

// get functions (未有token)
const getTokenTimestamp = () => window.localStorage.getItem('spotify_token_timestamp');
const getLocalAccessToken = () => window.localStorage.getItem('spotify_access_token');
const getLocalRefreshToken = () => window.localStorage.getItem('spotify_refresh_token');

// Refresh the token
const refreshAccessToken = async () => {
  try {
    // 這裡剛登入進去之後好像都會拿不到token
    const { data } = await axios.get(`/refresh_token?refresh_token=${getLocalRefreshToken()}`);
    const { access_token } = data;
    setLocalAccessToken(access_token);
    window.location.reload();
    return;
  } catch (e) {
    console.log(e);
  }
};


////////////////////////////////////////////
// Get access token off of query params (called on application init)
// A. 
export const getAccessToken = () => {
  // 0. get data
  const { error, access_token, refresh_token } = getHashParams();

  // 1. condition of token invalid
  if (error) {
    console.error(error);
    refreshAccessToken();
  }

  // 2. condition of token expiration
  if (Date.now() - getTokenTimestamp() > EXPIRATION_TIME) {
    console.log('The access token of spotiland user has expired, refreshing...');
    refreshAccessToken();
  }

  // 3. get access token from params, store it in local, return it.
  const localAccessToken = getLocalAccessToken();
  if ((!localAccessToken || localAccessToken === 'undefined') && access_token) {
    setLocalAccessToken(access_token);
    setLocalRefreshToken(refresh_token);
    return access_token;
  }

  return localAccessToken;
};



// B. 
export const logout = () => {
  console.log("logging out.....")
  window.localStorage.removeItem('spotify_token_timestamp');
  window.localStorage.removeItem('spotify_access_token');
  window.localStorage.removeItem('spotify_refresh_token');
  window.location.reload();
};




//////////////////////////////////////////////
// 取得spotify web api原生data
axios.defaults.baseURL = 'https://api.spotify.com/v1';
const token = getAccessToken();
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

///////////////////////////////////////////
// personal info
/**
 * Get Current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
export const getUser = () => axios.get('/me', { headers });

export const getFollowing = () =>
  axios.get('/me/following?type=artist', { headers });

export const getRecentlyPlayed = () =>
  axios.get('/me/player/recently-played', { headers });

export const getPlaylists = () => axios.get('/me/playlists', { headers });

///////////////////////////////////////////
// time range
/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopArtistsShort = () =>
  axios.get('/me/top/artists?limit=50&time_range=short_term', {
    headers,
  });
export const getTopArtistsMedium = () =>
  axios.get('/me/top/artists?limit=50&time_range=medium_term', {
    headers,
  });
export const getTopArtistsLong = () =>
  axios.get('/me/top/artists?limit=50&time_range=long_term', { headers });

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopTracksShort = () =>
  axios.get('/me/top/tracks?limit=50&time_range=short_term', { headers });
export const getTopTracksMedium = () =>
  axios.get('/me/top/tracks?limit=50&time_range=medium_term', {
    headers,
  });
export const getTopTracksLong = () =>
  axios.get('/me/top/tracks?limit=50&time_range=long_term', { headers });


///////////////////////////////////////////
// track info
/**
 * Get a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 * result:
 * "name": "Cut To The Feeling" (album name),
    "release_date": "2017-05-26",
    "id": "0tGPJ0bkWOUmH7MEOR77qc"
    "external_urls": {
            "spotify": "https://open.spotify.com/album/0tGPJ0bkWOUmH7MEOR77qc"
        },
 */
 export const getTrack = trackId =>
 axios.get(`/tracks/${trackId}`, { headers });

/**
* Get Audio Features for a Track
* https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
* result:
  "danceability": 0.696,
    "energy": 0.905,
    "key": 2,
    "loudness": -2.743,
    "mode": 1,
    "speechiness": 0.103,
    "acousticness": 0.0110,
    "instrumentalness": 0.000905,
    "liveness": 0.302,
    "valence": 0.625,
    "tempo": 114.944
*/
export const getTrackAudioFeatures = trackId =>
 axios.get(`/audio-features/${trackId}`, { headers });

/**
* Get Audio Analysis for a Track
* https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/
*/
export const getTrackAudioAnalysis = trackId =>
 axios.get(`/audio-analysis/${trackId}`, { headers });





///////////////////////////////////////////
// personal playlist info
/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/
 */
export const getPlaylist = playlistId =>
  axios.get(`/playlists/${playlistId}`, { headers });

/**
 * Get a Playlist's Tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 */
export const getPlaylistTracks = playlistId =>
  axios.get(`/playlists/${playlistId}/tracks`, { headers });

/**
 * Return a comma separated string of track IDs from the given array of tracks
 */
const getTrackIds = tracks => tracks.map(({ track }) => track.id).join(',');

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
 */
export const getAudioFeaturesForTracks = tracks => {
  const ids = getTrackIds(tracks);
  return axios.get(`/audio-features?ids=${ids}`, { headers });
};

/**
 * Get Recommendations Based on Seeds
 * https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
 */
export const getRecommendationsForTracks = tracks => {
  const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
  const seed_tracks = getTrackIds(shuffledTracks.slice(0, 5));
  const seed_artists = '';
  const seed_genres = '';

  return axios.get(
    `/recommendations?seed_tracks=${seed_tracks}&seed_artists=${seed_artists}&seed_genres=${seed_genres}`,
    {
      headers,
    },
  );
};





/////////////////////////////////////////////
// 3 main functions we will use: user, artist, track
// for user & track: combined info got
  // 相當於建構自己的wrapper
  // axios: all, then, spread
export const getUserInfo = () =>
  axios
    .all([getUser(), getTopArtistsLong(), getTopTracksLong()])
    .then(
      axios.spread((user, topArtists, topTracks) => ({
        user: user.data,
        topArtists: topArtists.data,
        topTracks: topTracks.data,
      })),
    );
    
export const getTrackInfo = trackId =>
  axios
    .all([getTrack(trackId), getTrackAudioAnalysis(trackId), getTrackAudioFeatures(trackId)])
    .then(
      axios.spread((track, audioAnalysis, audioFeatures) => ({
        track: track.data,
        audioAnalysis: audioAnalysis.data,
        audioFeatures: audioFeatures.data,
      })),
    );

/**
 * Get an Artist
 * https://developer.spotify.com/documentation/web-api/reference/artists/get-artist/
 */
export const getArtist = artistId =>
axios.get(`/artists/${artistId}`, { headers });
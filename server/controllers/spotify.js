const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');


const getTopSingers = async (req, res) => {
};



const getTopTracks = async (req, res) => {
    // 1. init apotify api
    const spotifyApi = new SpotifyWebApi();
    const userToken = req.body.token;
    spotifyApi.setAccessToken(userToken);

    // 2. get my personal data
    const me = await spotifyApi.getMe();

    // 3. get top 20 tracks
    const username = me.body.id;
    const data = await spotifyApi.getUserPlaylists(username);
    const playlists = data.body.items;

    // 4. get songs from top 20 tracks
    let trackNames = [];
    for (let playlist of playlists) {
        const playlistId = playlist.id;
        const data2 = await spotifyApi.getPlaylistTracks(playlistId, {
            offset: 1,
            limit: 100,
            fields: 'items'
        })
        const tracks = data2.body.items;
        for (let track of tracks) {
            trackNames.push(track.track.name);
        }
    }
    res.send(trackNames)
};

module.exports = {
    getTopSingers,
    getTopTracks
};
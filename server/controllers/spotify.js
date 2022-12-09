const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');


const getTopSingers = async (req, res) => {
    const spotifyApi = new SpotifyWebApi();
    const userToken = req.body.token;
    spotifyApi.setAccessToken(userToken);
    


};

const getTopTracks = async () => {

};

module.exports = {
    getTopSingers,
    getTopTracks
};
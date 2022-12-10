const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')

const scopes = [
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
];


const spotifyApi = new SpotifyWebApi({
    clientId: '0ec13dbf901b408499d081ce5400914f',
    clientSecret: '7fafd4e27b5f4517afbcf6cb1fdbed19',
    redirectUri: 'http://localhost:3000/api/1.0/callback'
});


const login = async (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
};

const callback = async (req, res) => {
    const error = req.query.error;
    const code = req.query.code;  // for authorizing the specific spotify user more permissions

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            // data contains: access_token, token_type(Bearer), expires_in, refresh_token, scope
            // 1. retrieve info
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];
            
            // 2. set access token / refresh token
            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);
            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);

            // 3. send back expire time to console
            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );
            res.send('Successfully logged in!');

            // 4. if refresh token is required then perform action
            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];
                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);
        })
        .catch(error => {
            console.error('Error', error);
            res.send(`Error: ${error}`);
        });
};

module.exports = {
    login,
    callback
};
require('dotenv').config();
const request = require('request');
const { URLSearchParams } = require('url');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:8888/callback';
let FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
const PORT = process.env.PORT || 8888;
if (process.env.NODE_ENV !== 'production') {
    REDIRECT_URI = 'http://localhost:8888/callback';
    FRONTEND_URI = 'http://localhost:3000';
}

const {generateRandomString, stateKey} = require('../utils/utils')


const login = (req, res) => {
    // your application requests authorization
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // cannot use env variables! (不知道為何但用了會讀不到)
    const scope = 'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public';
    let qstring = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
    });
    res.redirect(
        `https://accounts.spotify.com/authorize?${qstring}`,
    );
};

const callback = async(req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        let qstring = new URLSearchParams({ error: 'state_mismatch' });
        res.redirect(`/#${qstring}`);
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            },
            headers: {
                Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
                    'base64',
                )}`,
            },
            json: true,
        };
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token;
                const refresh_token = body.refresh_token;

                // we can also pass the token to the browser to make requests from there
                let qstring = new URLSearchParams({
                    access_token,
                    refresh_token,
                });
                res.redirect(
                    `${FRONTEND_URI}/#${qstring}`,
                );
            } else {
                let qstring = new URLSearchParams({ error: 'invalid_token' });
                res.redirect(`/#${qstring}`);
            }
        });
    }
};

const refreshToken = (req, res) => {
    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
                'base64',
            )}`,
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token,
        },
        json: true,
    };
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.send({ access_token });
        }
    });
};

module.exports = {
    login,
    callback,
    refreshToken
}
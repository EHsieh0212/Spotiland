require('dotenv').config();
const request = require('request');
const { URLSearchParams } = require('url');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = process.env.REDIRECT_URI;
let FRONTEND_URI = process.env.FRONTEND_URI;
let HOST_URI = process.env.HOST_URI;
const {generateRandomString} = require('../utils')


const login = (req, res) => {
    // The state query param is kind of a security measure — it protects against attacks such as cross-site request forgery
    const state = generateRandomString(16);
    const scope =
      'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public';
  
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
    const code = req.query.code || null;
    const state = req.query.state || null;
  
    // To exchange the authorization code for an access token, we need this route handler to send a POST request to the Spotify Accounts Service /api/token endpoint
    //The three params required for the /api/token endpoint are grant_type, code, and redirect_uri
    // The token endpoint also has a required Authorization header, which needs to be a base 64 encoded string in this format: Authorization: Basic <base 64 encoded client_id:client_secret>
    let stateMismatchErrorString = new URLSearchParams({ error: 'state_mismatch' });
    let invalidTokenErrorString = new URLSearchParams({ error: 'invalid_token' });
  
    if (state === null) {
      res.redirect(`/#${stateMismatchErrorString}`);
    } else {
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
  
      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const refresh_token = body.refresh_token;
  
        //   we can also pass the token to the browser to make requests from there
          res.redirect(`${HOST_URI}/refresh_token?refresh_token=${refresh_token}`);
        } else {
          res.redirect(`/#${invalidTokenErrorString}`);
        }
      });
    }
  };
  
  const refreshToken = (req, res) => {
    // uses refresh_token to ask for access token from https://accounts.spotify.com/api/token
      // grant_type: 'refresh_token'
      // code: refres token
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
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        let qstring = new URLSearchParams({
          access_token,
          refresh_token,
      });
        res.redirect(`${FRONTEND_URI}/?${qstring}`);
      }
    });
  };


module.exports = {
    login,
    callback,
    refreshToken
}
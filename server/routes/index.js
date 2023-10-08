const router = require('express').Router();

// get controllers
const {
    login, 
    callback,
    refreshToken
} = require('../controllers/login');

// create routes
router.get('/login', login);
router.get('/callback', callback);
router.get('/refresh_token', refreshToken);

module.exports = router;
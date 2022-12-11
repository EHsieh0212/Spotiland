const router = require('express').Router();

// get middleware
const { wrapAsync } = require('../utils/utils');

// get controllers
const {
    login, 
    callback,
    refreshToken
} = require('../controllers/login');

// create routes
router.route('/login')
    .get(wrapAsync(login));

router.route('/callback')
    .get(wrapAsync(callback));

router.route('/refresh_token')
    .get(wrapAsync(refreshToken));


module.exports = router;
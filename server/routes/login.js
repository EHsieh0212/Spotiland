const router = require('express').Router();

// get middleware
const { wrapAsync } = require('../util/utils');

// get controllers
const {
    login, 
    callback
} = require('../controllers/login');

// create routes
// q: wrapAsync無法被使用
router.route('/login')
    .get(login);

router.route('/callback')
    .get(callback);


module.exports = router;
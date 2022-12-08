const router = require('express').Router();

// get middleware
const { wrapAsync } = require('../util/utils');

// get controllers
const {
    getTopSingers,
    getTopTracks
} = require('../controllers/spotify');

// create routes
// q: wrapAsync無法被使用 （一樣的問題）
router.route('/poc/getTopSingers')
    .get(getTopSingers);

router.route('/poc/getTopTracks')
    .get(getTopTracks);

module.exports = router;
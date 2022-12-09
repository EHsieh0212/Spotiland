// required packages & env variables
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PORT, API_VERSION } = process.env;


// init express app
const app  = express();


// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// routers
app.use('/api/' + API_VERSION, [
    require('./server/routes/spotify.js'),
    require('./server/routes/login.js'),
]);


// page not found
app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + '/public/404.html');
});


// error handling
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send('Internal Server Error');
});


// activating app
app.listen(PORT, () => {
    console.log(`Spotiland app listening on port ${PORT}`);
});


module.exports = app;
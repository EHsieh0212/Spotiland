// env setting
require('dotenv').config();
const PORT = process.env.PORT || 8000;


// required packages
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');


// init express app
const app = express();


// middlewares
app.use(express.json())
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(cors());


// serve any static files in priority
app.use(express.static(path.resolve(__dirname, '../client/public')));
app.get('/', function (req, res) {
  res.render(path.resolve(__dirname, '../client/build/index.html'));
});


// routers
app.use([
  require('./routes/login.js')
]);


// All remaining requests return the React app, so it can handle routing
// 神來之筆
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});


// error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});


app.listen(PORT, function () {
  console.log(`Spotiland listening on port ${PORT}`);
});
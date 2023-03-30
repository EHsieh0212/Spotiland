// env setting
require('dotenv').config();
const PORT = process.env.PORT || 8000;


// required packages
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const history = require('connect-history-api-fallback');


// init express app
const app = express();


// middlewares
app.use(express.json())
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(cors());


// serve any static files in priority
app.use(express.static(path.resolve(__dirname, '../client/public')));

app.use(express.static(path.resolve(__dirname, '../client/build')));

app
  .use(express.static(path.resolve(__dirname, '../client/build')))
  .use(cors())
  .use(cookieParser())
  .use(
    history({
      verbose: true,
      rewrites: [
        { from: /\/login/, to: '/login' },
        { from: /\/callback/, to: '/callback' },
        { from: /\/refresh_token/, to: '/refresh_token' },
      ],
    }),
  )
  .use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/', function (req, res) {
  res.render(path.resolve(__dirname, '../client/build/index.html'));
});


// routers
app.use([
  require('./routes/login.js')
]);





// error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});



// All remaining requests return the React app, so it can handle routing
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});


app.listen(PORT, function () {
  console.log(`Spotiland listening on port ${PORT}`);
});
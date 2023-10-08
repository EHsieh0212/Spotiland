require('dotenv').config();

const PORT = process.env.PORT;

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const history = require('connect-history-api-fallback');
const routers = require('./routes');
const { wrapAsync } = require('./utils');

const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Middlewares
app
.use(cors())
.use(cookieParser())
.use(routers)
.use(wrapAsync)
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


app.get('/', function (req, res) {
  res.render(path.resolve(__dirname, '../client/build/index.html'));
});


// All remaining requests return the React app, so it can handle routing.
// app.get('*', function (request, response) {
//   response.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
// });

app.listen(PORT, function () {
  console.warn(`Spotiland listening on port ${PORT}`);
});

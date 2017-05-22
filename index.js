const passport = require('passport');
const ControlTowerStrategy = require('passport-control-tower');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.load();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/login');
}

// Use the Control Tower Strategy within Passport.
passport.use(new ControlTowerStrategy({
  apiUrl: process.env.LOGIN_URL,
  callbackUrl: 'localhost:9000'
}));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

const { createServer } = require('http');
const next = require('next');
const routes = require('./routes');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = routes.getRequestHandler(app);

app.prepare()
.then(() => {
  createServer(handler)
  .listen(9000, err => {
    if (err) {
      throw err;
    }
    console.log('> Ready on http://localhost:9000');
  });
});

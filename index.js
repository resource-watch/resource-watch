const express = require('express');
const passport = require('passport');
const next = require('next');
const cookieSession = require('cookie-session');
const ControlTowerStrategy = require('passport-control-tower');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { parse } = require('url');
const routes = require('./routes');

// Load environment variables from .env file if present
const dotenv = require('dotenv').load();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Next app creation
const app = next({ dev });
const handle = routes.getRequestHandler(app);

// Express app creation
const server = express();

function isAuthenticated(req, res, nextAction) {
  if (req.isAuthenticated()) return nextAction();
  // if they aren't redirect them to the home page
  res.redirect('/login');
}

// Use the Control Tower Strategy within Passport.
passport.use(new ControlTowerStrategy({
  apiUrl: process.env.CONTROL_TOWER_URL,
  callbackUrl: process.env.CALLBACK_URL
}));

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// configure Express
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
// server.use(session({
//   secret: process.env.SECRET || 'keyboard cat',
//   resave: false,
//   saveUninitialized: false
// }));
server.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET || 'keyboard cat']
}))
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
server.use(passport.initialize());
server.use(passport.session());

// Initializing next app before express server
app.prepare()
  .then(() => {
    // Public/landing page
    server.get('/', function (req, res) {
      return app.render(req, res, '/app/Home');
    });

    server.get('/login', passport.authenticate('control-tower'), function (req, res) {
      // Success
      res.redirect('/admin');
    });


    server.get('/logout', function (req, res) {
      req.session.destroy();
      req.logout();
      // Success
      res.redirect('/');
    });

    server.get('/admin', isAuthenticated, function (req, res) {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    });

    server.use(handle);

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });

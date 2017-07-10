const express = require('express');
const passport = require('passport');
const next = require('next');
const cookieSession = require('cookie-session');
const session = require('express-session');
const ControlTowerStrategy = require('passport-control-tower');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
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

function auth(username, password) {
  return function authMiddleware(req, res, next) {
    const user = basicAuth(req);
    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    }
    return next();
  };
}

if (process.env.NODE_ENV === 'production') {
  server.use(auth(process.env.USERNAME, process.env.PASSWORD));
}

function isAuthenticated(req, res, nextAction) {
  if (req.isAuthenticated()) return nextAction();
  // if they aren't redirect them to the home page
  return res.redirect('/');
}

function isAdmin(req, res, nextAction) {
  if (req.user.role === 'ADMIN') return nextAction();
  // if they aren't redirect them to the home page
  return res.redirect('/');
}

// Use the Control Tower Strategy within Passport.
const controlTowerStrategy = new ControlTowerStrategy({
  controlTowerUrl: process.env.CONTROL_TOWER_URL,
  callbackUrl: process.env.CALLBACK_URL
});
passport.use(controlTowerStrategy);

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
server.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET || 'keyboard cat']
}));
server.use(session({
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport!
server.use(passport.initialize());
server.use(passport.session());

// Initializing next app before express server
app.prepare()
  .then(() => {
    // Public/landing page
    server.get('/', function (req, res) {
      return app.render(req, res, '/app/Home');
    });

    server.get('/auth', passport.authenticate('control-tower', { failureRedirect: '/' }), function (req, res) {
      // On success, redirecting to My RW
      res.redirect('/myrw');
    });

    server.get('/auth/user', function (req, res) {
      // On success, redirecting to My RW
      return res.json(req.user || {});
    });

    server.get('/login', function(req, res) {
      controlTowerStrategy.login(req, res);
    });

    server.get('/logout', function (req, res) {
      req.logout();
      res.redirect(req.query.callbackUrl)
    });

    server.get('/myrw*?', isAuthenticated, function (req, res) {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    });

    server.get('/admin*?', isAuthenticated, isAdmin, function (req, res) {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    });

    server.use(handle);

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });

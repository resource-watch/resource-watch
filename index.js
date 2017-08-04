require('dotenv').load();

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

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Next app creation
const app = next({ dev });
const handle = routes.getRequestHandler(app);

// Express app creation
const server = express();

function auth(username, password) {
  return function authMiddleware(req, res, nextAction) {
    const user = basicAuth(req);
    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    }
    return nextAction();
  };
}

function isAuthenticated(req, res, nextAction) {
  if (req.isAuthenticated()) return nextAction();
  // if they aren't redirect them to the home page
  return res.redirect('/login');
}

function isAdmin(req, res, nextAction) {
  if (req.user.role === 'ADMIN') return nextAction();
  // if they aren't redirect them to the home page
  return res.redirect('/myrw');
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
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

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
server.use('/static', express.static('static'));

if (process.env.NODE_ENV === 'production') {
  server.use(auth(process.env.USERNAME, process.env.PASSWORD));
}

// Initialize Passport!
server.use(passport.initialize());
server.use(passport.session());

// Initializing next app before express server
app.prepare()
  .then(() => {
    // Add route to serve compiled SCSS from /assets/{build id}/main.css
    // Note: This is is only used in production, in development it is inlined
    const sassResult = sass.renderSync({ file: './css/index.scss', outputStyle: 'compressed' });
    server.get('/styles/:id/index.css', (req, res) => {
      res.setHeader('Content-Type', 'text/css');
      res.setHeader('Cache-Control', 'public, max-age=2592000');
      res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
      res.send(sassResult.css);
    });

    server.get('/data', (req, res) => res.redirect('/data/explore'));

    // On success, redirecting to My RW
    server.get('/auth', passport.authenticate('control-tower', { failureRedirect: '/' }),
      (req, res) => res.redirect('/myrw'));

    server.get('/auth/user', (req, res) => res.json(req.user || {}));

    server.get('/login', (req, res) => controlTowerStrategy.login(req, res));

    server.get('/logout', (req, res) => {
      req.logout();
      return res.redirect('/');
    });

    const handleUrl = (req, res) => {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    };

    server.get('/myrw*?', isAuthenticated, handleUrl);
    server.get('/admin*?', isAuthenticated, isAdmin, handleUrl);

    server.use(handle);

    server.listen(port, (err) => {
      if (err) throw err;
      console.info(`> Ready on http://localhost:${port}`);
    });
  });

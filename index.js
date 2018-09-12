require('dotenv').load();

const express = require('express');
const next = require('next');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const serveStatic = require('serve-static');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const { parse } = require('url');
const path = require('path');
const routes = require('./routes');
const auth = require('./auth');

const port = process.env.PORT || 3000;
const prod = process.env.NODE_ENV === 'production';

// Next app creation
const app = next({ dev: !prod });
const handle = routes.getRequestHandler(app, ({ req, res, route, query }) => {
  app.render(req, res, route.page, query);
});

// Express app creation
const server = express();

function checkBasicAuth(users) {
  return function authMiddleware(req, res, nextAction) {
    if (!/(AddSearchBot)|(HeadlessChrome)/.test(req.headers['user-agent'])) {
      const user = basicAuth(req);
      let authorized = false;
      if (user && ((user.name === users[0].name && user.pass === users[0].pass) ||
        (user.name === users[1].name && user.pass === users[1].pass))) {
        authorized = true;
      }

      if (!authorized) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
      }
    }
    return nextAction();
  };
}

function isAuthenticated(req, res, nextAction) {
  // Saving referrer of user
  req.session.referrer = req.url;
  if (req.isAuthenticated()) return nextAction();
  // if they aren't redirect them to the home page
  return res.redirect('/login');
}

function isAdmin(req, res, nextAction) {
  if (req.user.role === 'ADMIN') return nextAction();
  // if they aren't redirect them to the home page
  return res.redirect('/myrw');
}

// Configuring session and cookie options
const sessionOptions = {
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true
};

if (prod) {
  const redisClient = redis.createClient(process.env.REDIS_URL);
  sessionOptions.store = new RedisStore({
    client: redisClient,
    logErrors: true,
    prefix: 'resourcewatch_sess_'
  });
}

// Using basic auth in prod mode
const { USERNAME, PASSWORD, RW_USERNAME, RW_PASSWORD } = process.env;
if (prod && ((USERNAME && PASSWORD) || (RW_USERNAME && RW_PASSWORD))) {
  server.use(checkBasicAuth([{
    name: USERNAME,
    pass: PASSWORD
  }, {
    name: RW_USERNAME,
    pass: RW_PASSWORD
  }]));
}

// configure Express
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(session(sessionOptions));
server.use(serveStatic(path.join(__dirname, 'static')));

// Middleware check: Make sure that we trigger auth if a token is passed to RW
server.use((req, res, nextAction) => {
  if (req.query && req.query.token && !/auth/.test(req.url)) {
    return res.redirect(`/auth?token=${req.query.token}`);
  }
  return nextAction();
});

// Authentication
auth.initialize(server);

// Initializing next app before express server
app.prepare()
  .then(() => {
    // Configuring next routes with express
    const handleUrl = (req, res) => {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    };

    // Redirecting data to data/explore
    // TODO: create data page
    server.get('/data', (req, res) => res.redirect('/data/explore'));

    // Authentication
    server.get('/auth', auth.authenticate({ failureRedirect: '/login' }), (req, res) => {
      if (req.user.role === 'ADMIN' && /admin/.test(req.session.referrer)) return res.redirect('/admin');
      const authRedirect = req.cookies.authUrl || '/myrw';

      if (req.cookies.authUrl) {
        res.clearCookie('authUrl');
      }

      return res.redirect(authRedirect);
    });

    // Authenticate specific service, and set authUrl cookie so we remember where we where
    server.get('/auth/:service', (req, res) => {
      const { service } = req.params;

      // Returning user data
      if (service === 'user') return res.json(req.user || {});

      if (!/facebook|google|twitter/.test(service)) {
        return res.redirect('/');
      }

      if (req.cookies.authUrl) {
        res.clearCookie('authUrl');
      }

      // save the current url for redirect if successfull, set it to expire in 5 min
      res.cookie('authUrl', req.headers.referer, { maxAge: 3E5, httpOnly: true });
      return res.redirect(`${process.env.CONTROL_TOWER_URL}/auth/${service}?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true&origin=rw`);
    });

    server.get('/login', auth.login);
    server.get('/logout', (req, res) => {
      req.session.destroy();
      req.logout();
      res.redirect('back');
    });

    // Routes with required authentication
    server.get('/myrw-detail*?', isAuthenticated, handleUrl); // TODO: review these routes
    server.get('/myrw*?', isAuthenticated, handleUrl);
    server.get('/admin*?', isAuthenticated, isAdmin, handleUrl);

    server.use(handle);

    server.listen(port, (err) => {
      if (err) throw err;
      console.info(`> Ready on http://localhost:${port} [${process.env.NODE_ENV || 'development'}]`);
    });
  });

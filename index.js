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
const prod = process.env.RW_NODE_ENV === 'production';

// Next app creation
const app = next({ dev: !prod });
const handle = routes.getRequestHandler(app, ({
  req, res, route, query,
}) => {
  app.render(req, res, route.page, query);
});

// Express app creation
const server = express();

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
server.disable('x-powered-by');

function checkBasicAuth(credentials) {
  return function authMiddleware(req, res, nextAction) {
    if (!/(AddSearchBot)|(HeadlessChrome)/.test(req.headers['user-agent'])) {
      const user = basicAuth(req);
      let authorized = false;
      if (user && (user.name === credentials.name && user.pass === credentials.pass)) {
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
  if (req.session) req.session.referrer = req.url;
  if (req.isAuthenticated()) return nextAction();

  return res.redirect('/sign-in');
}

function isAdmin(req, res, nextAction) {
  if (req.user.role === 'ADMIN') return nextAction();
  // if the user has not admin role, it will be redirect to the sign-in/register page
  return res.redirect('/sign-in');
}

// Configuring session and cookie options
const sessionOptions = {
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
};

if (prod) {
  const redisClient = redis.createClient(process.env.REDIS_URL);
  sessionOptions.store = new RedisStore({
    client: redisClient,
    logErrors: true,
    prefix: 'resourcewatch_sess_',
  });
}

// Using basic auth in prod mode
const { RW_USERNAME, RW_PASSWORD } = process.env;
if (prod && (RW_USERNAME && RW_PASSWORD)) {
  server.use(
    checkBasicAuth({
      name: RW_USERNAME,
      pass: RW_PASSWORD,
    }),
  );
}

// configure Express
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(session(sessionOptions));
server.use(serveStatic(path.join(__dirname, 'public')));

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
app.prepare().then(() => {
  // Configuring next routes with express
  const handleUrl = (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  };

  // Redirecting data to data/explore
  server.get('/data', (req, res) => res.redirect('/data/explore'));

  // Redirecting 'topics' to 'dashboards'
  server.get('/topics', (req, res) => res.redirect('/dashboards'));
  // Redirecting specific 'topic' pages to new 'dashboard' pages
  server.get('/topics/:id', (req, res) => {
    const { id } = req.params;
    res.redirect(`/dashboards/${id}`);
  });

  // Authentication
  server.get(
    '/auth',
    auth.authenticate({ failureRedirect: '/sign-in' }),
    (req, res) => {
      if (req.user.role === 'ADMIN' && /admin/.test(req.session.referrer)) return res.redirect('/admin');
      const authRedirect = req.cookies.authUrl || '/myrw/widgets/my_widgets';

      if (req.cookies.authUrl) {
        res.clearCookie('authUrl');
      }

      return res.redirect(authRedirect);
    },
  );

  // Authenticate specific service, and set authUrl cookie so we remember where we where
  server.get('/auth/:service', (req, res) => {
    const { service } = req.params;

    // Returning user data
    if (service === 'user') return res.json(req.user || {});

    if (!/facebook|google|twitter/.test(service)) {
      return res.redirect('/sign-in');
    }

    if (req.cookies.authUrl) {
      res.clearCookie('authUrl');
    }

    // save the current url for redirect if successfull, set it to expire in 5 min
    res.cookie('authUrl', req.headers.referer, { maxAge: 3e5, httpOnly: true });
    return res.redirect(
      `${process.env.CONTROL_TOWER_URL}/auth/${service}?callbackUrl=${
        process.env.CALLBACK_URL
      }&applications=rw&token=true&origin=rw`,
    );
  });

  // if the user is already logged-in, redirect it to /myrw
  // if it tries to go to sign-in page
  server.get('/sign-in', (req, res, nextAction) => {
    if (req.isAuthenticated()) res.redirect('/myrw');
    return nextAction();
  });

  server.get('/login', auth.login);
  server.get('/logout', (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('back');
  });

  // authenticated routes
  server.get('/myrw', isAuthenticated, (req, res) => {
    res.redirect('/myrw/widgets/my_widgets');
  });
  server.get('/myrw-detail*?', isAuthenticated, handleUrl); // TODO: review these routes
  server.get('/myrw*?', isAuthenticated, handleUrl);
  server.get('/admin*?', isAuthenticated, isAdmin, handleUrl);

  // local sign-in
  server.post('/local-sign-in', auth.signin);

  // updates user data
  server.post('/update-user', auth.updateUser);

  server.use(handle);

  server.listen(port, (err) => {
    if (err) throw err;
    console.info(
      `> Ready on http://localhost:${port} [${process.env.RW_NODE_ENV
        || 'development'}]`,
    );
  });
});

// Load environment variables from .env, .env.local, etc. This explicit call
// into `@next/env` allows using environment variables before next() is called.
// More info: https://nextjs.org/docs/basic-features/environment-variables
const { loadEnvConfig } = require('@next/env');

const projectDir = process.cwd();

loadEnvConfig(
  projectDir,
  process.env.NODE_ENV === 'development',
);

const express = require('express');
const next = require('next');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const serveStatic = require('serve-static');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const path = require('path');

const port = process.env.PORT || 3000;

// We need next in prod mode for production and testing environments
// Otherwise, in test, next will compile crap on the fly and timeout tests
const prod = process.env.NODE_ENV !== 'development';

// Next app creation
const app = next({ dev: !prod });
const handle = app.getRequestHandler();

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

// Configuring session and cookie options
const sessionOptions = {
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
};

if (prod && process.env.REDIS_URL) {
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

// Initializing next app before express server
async function init() {
  return new Promise((resolve, reject) => {
    if (process.env.SERVER_ONLY !== 'true') {
      app.prepare().then(() => {
        server.all('*', (req, res) => handle(req, res));

        const httpListener = server.listen(port, (err) => {
          if (err) {
            reject(err);
          }
          console.info(
            `> Ready on http://localhost:${port} [RW_ENV: ${process.env.NEXT_PUBLIC_RW_ENV || 'development'}] [NODE_ENV: ${process.env.NODE_ENV}]`,
          );
          resolve({ httpListener });
        });
      });
    } else {
      // If we want server mode only, we can skip next.prepare(), which does all
      // the frontend stuff that's not needed for pure API testing.
      const httpListener = server.listen(port, (err) => {
        if (err) {
          reject(err);
        }
        console.info(
          `> Ready on http://localhost:${port} [RW_ENV: ${process.env.NEXT_PUBLIC_RW_ENV || 'development'}] [NODE_ENV: ${process.env.NODE_ENV}]`,
        );
        resolve({ httpListener });
      });
    }
  });
}

module.exports = init;

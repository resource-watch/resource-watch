require('isomorphic-fetch');

const passport = require('passport');
const ControlTowerStrategy = require('passport-control-tower');
const LocalStrategy = require('passport-local').Strategy;
const MockStrategy = require('passport-mock-strategy');
const queryString = require('query-string');
const userPayload = require('../test/payload/user');

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = (() => {
  const strategy = new ControlTowerStrategy({
    controlTowerUrl: process.env.WRI_API_URL,
    callbackUrl: process.env.CALLBACK_URL,
    applications: process.env.APPLICATIONS || 'rw',
  });
  const mockStrategy = new MockStrategy({
    user: userPayload,
  });
  const localStrategy = new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: true },
    (email, password, done) => {
      const queryParams = queryString.stringify({
        callbackUrl: process.env.CALLBACK_URL,
        applications: 'rw',
        token: true,
        origin: 'rw',
      });

      fetch(`${process.env.WRI_API_URL}/auth/login?${queryParams}`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw response;
        })
        .then(
          ({ data }) => done(null, data),
        )
        .catch(
          (err) => {
            err.json().then((b) => done(b));
          },
        )
        .catch((err) => done(err));
    },
  );
  passport.use(strategy);
  passport.use('local-signin', localStrategy);
  passport.use('mock-signin', mockStrategy);

  return {
    initialize: (server) => {
      server.use(passport.initialize());
      server.use(passport.session());
    },
    authenticate: (authOptions) => passport.authenticate('control-tower', authOptions),
    login: (req, res) => strategy.login(req, res),
    // local sign-in
    signin: (req, res, done) => passport.authenticate('local-signin', (err, user) => {
      if (err && err.errors && err.errors[0] && err.errors[0]) {
        const {
          detail: errDetail,
          status: errStatus,
        } = err.errors[0];
        let responseMessage = '';
        const responseStatus = errStatus || 500;

        switch (errDetail) {
          case 'Database unavailable':
            responseMessage = 'There was an issue with the login. Please, try again later.';
            break;
          case 'Invalid email or password':
            responseMessage = 'Invalid Login';
            break;
          default:
            responseMessage = errDetail || 'Something went wrong.';
        }

        return res.status(responseStatus).json({
          status: 'error',
          statusCode: responseStatus,
          message: responseMessage,
        });
      }
      // if (!user) {
      //   return res
      //     .status(401)
      //     .json({ status: 'error', message: 'Invalid Login' });
      // }
      return req.login(user, {}, (loginError) => {
        if (loginError) {
          return res.status(401).json({ status: 'error', message: loginError });
        }
        return res.json(req.user);
      });
    })(req, res, done),
    updateUser: (req, res) => {
      const { body } = req;
      const { userObj, token } = body;

      fetch(`${process.env.WRI_API_URL}/auth/user/me`, {
        method: 'PATCH',
        body: JSON.stringify(userObj),
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
        .then((response) => {
          if (response.status >= 400) throw new Error(response.statusText);
          return response.json();
        })
        .then((user) => req.login({ ...user, token }, {}, (err) => {
          if (err) return res.status(401).json({ status: 'error', message: err });
          return res.json({
            ...user,
            token: userObj.token,
          });
        }));
    },
    mockSignIn: (req, res, done) => passport.authenticate('mock-signin',
      (err, user) => req.login(user, {}, (loginError) => {
        if (loginError) {
          return res.status(401).json({ status: 'error', message: loginError });
        }
        return res.json(req.user);
      }))(req, res, done),
  };
})();

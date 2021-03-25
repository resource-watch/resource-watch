const passport = require('passport');
const ControlTowerStrategy = require('passport-control-tower');
const LocalStrategy = require('passport-local').Strategy;
const MockStrategy = ((process.env.NODE_ENV === 'test' && process.env.TEST_ENV === 'FRONTEND') ? require('passport-mock-strategy') : null);
const queryString = require('query-string');
const axios = require('axios');
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
    controlTowerUrl: process.env.NEXT_PUBLIC_WRI_API_URL,
    callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL,
    applications: process.env.NEXT_PUBLIC_APPLICATIONS || 'rw',
  });

  const localStrategy = new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: true },
    (email, password, done) => {
      const queryParams = queryString.stringify({
        callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL,
        applications: 'rw',
        token: true,
        origin: 'rw',
      });

      axios.post(`${process.env.NEXT_PUBLIC_WRI_API_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: queryParams,
        })
        .then((response) => {
          if (response.status >= 400) throw new Error(response.statusText);
          return response.data;
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

  if (process.env.NODE_ENV === 'test' && process.env.TEST_ENV === 'FRONTEND') {
    passport.use('mock-signin', new MockStrategy({
      user: userPayload,
    }));
  }

  return {
    initialize: (server) => {
      server.use(passport.initialize());
      server.use(passport.session());
    },
    authenticate: (authOptions) => passport.authenticate('control-tower', authOptions),
    login: (req, res) => strategy.login(req, res),
    // local sign-in
    signin: (req, res, done) => passport.authenticate(((process.env.NODE_ENV === 'test' && process.env.TEST_ENV === 'FRONTEND') ? 'mock-signin' : 'local-signin'),
      (err, user) => {
        if (err && err.errors && err.errors[0] && err.errors[0]) {
          const {
            detail: errDetail,
            status: errStatus,
          } = err.errors[0];
          let responseMessage = '';
          const responseStatus = errStatus || 500;

          switch (errStatus) {
            case 401:
              responseMessage = 'Invalid Login';
              break;
            case 500:
              responseMessage = 'There was an issue with the login. Please, try again later.';
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

      axios.patch(`${process.env.NEXT_PUBLIC_WRI_API_URL}/auth/user/me`,
        {
          ...userObj,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then((response) => {
          if (response.status >= 400) throw new Error(response.statusText);
          return response.data;
        })
        .then(({ data: user }) => req.login({ ...user, token }, {}, (err) => {
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

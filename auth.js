const passport = require('passport');
const Strategy = require('passport-control-tower');
const LocalStrategy = require('passport-local').Strategy;
const queryString = require('query-string');

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
  const strategy = new Strategy({
    controlTowerUrl: process.env.CONTROL_TOWER_URL,
    callbackUrl: process.env.CALLBACK_URL,
    applications: process.env.APPLICATIONS || 'rw'
  });
  const localStrategy = new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: true },
    (email, password, done) => {
      const queryParams = queryString.stringify({
        callbackUrl: process.env.CALLBACK_URL,
        applications: 'rw',
        token: true,
        origin: 'rw'
      });

      fetch(`${process.env.CONTROL_TOWER_URL}/auth/login?${queryParams}`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw response;
        })
        .then(({ data }) => done(null, data))
        .catch(err => done(err));
    },
  );
  passport.use(strategy);
  passport.use('local-signin', localStrategy);

  return {
    initialize: (server) => {
      server.use(passport.initialize());
      server.use(passport.session());
    },
    authenticate: authOptions => passport.authenticate('control-tower', authOptions),
    login: (req, res) => strategy.login(req, res),
    // local sign-in
    signin: (req, res, done) =>
      passport.authenticate('local-signin', (err, user) => {
        if (err) {
          return res.status(401).json({ status: 'error', message: err.statusText });
        }
        if (!user) {
          return res
            .status(401)
            .json({ status: 'error', message: 'Invalid Login' });
        }
        return req.login(user, {}, (loginError) => {
          if (loginError) {
            return res.status(401).json({ status: 'error', message: loginError });
          }
          return res.json(req.user);
        });
      })(req, res, done)
  };
})();

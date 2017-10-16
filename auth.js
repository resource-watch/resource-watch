const passport = require('passport');
const Strategy = require('passport-control-tower');

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
  passport.use(strategy);
  return {
    initialize: (server) => {
      server.use(passport.initialize());
      server.use(passport.session());
    },
    authenticate: authOptions => passport.authenticate('control-tower', authOptions),
    login: (req, res) => strategy.login(req, res)
  };
})();

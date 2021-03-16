const express = require('express');
const auth = require('./auth');

const router = express.Router();

// Redirecting data to data/explore
router.get('/data', (req, res) => res.redirect('/data/explore'));

// Redirecting 'topics' to 'dashboards'
router.get('/topics', (req, res) => res.redirect('/dashboards'));
// Redirecting specific 'topic' pages to new 'dashboard' pages
router.get('/topics/:id', (req, res) => {
  const { id } = req.params;
  res.redirect(`/dashboards/${id}`);
});

// Authentication
router.get(
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
router.get('/auth/:service', (req, res) => {
  const { service } = req.params;

  // Returning user data
  if (service === 'user') return res.json(req.user || {});

  if (!/facebook|google|twitter/.test(service)) {
    return res.redirect('/sign-in');
  }

  if (req.cookies.authUrl) {
    res.clearCookie('authUrl');
  }

  // save the current url for redirect if successful, set it to expire in 5 min
  res.cookie('authUrl', req.headers.referer, { maxAge: 3e5, httpOnly: true });
  return res.redirect(
    `${process.env.NEXT_PUBLIC_WRI_API_URL}/auth/${service}?callbackUrl=${
      process.env.NEXT_PUBLIC_CALLBACK_URL
    }&applications=rw&token=true&origin=rw`,
  );
});

// if the user is already logged-in, redirect it to /myrw
// if it tries to go to sign-in page
router.get('/sign-in', (req, res, nextAction) => {
  if (req.isAuthenticated()) res.redirect('/myrw');
  return nextAction();
});

router.get('/login', auth.login);
router.get('/logout', (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect('back');
});

// local sign-in
router.post('/local-sign-in', ((process.env.NODE_ENV === 'test' && process.env.TEST_ENV === 'FRONTEND') ? auth.mockSignIn : auth.signin));

// updates user data
router.post('/update-user', auth.updateUser);

module.exports = router;

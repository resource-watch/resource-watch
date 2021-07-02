const express = require('express');
const auth = require('./auth');

const router = express.Router();

// Authentication
// router.get(
//   '/auth',
//   auth.authenticate({ failureRedirect: '/sign-in' }),
//   (req, res) => {
//     if (req.user.role === 'ADMIN' && /admin/.test(req.session.referrer)) return res.redirect('/admin');
//     const authRedirect = req.cookies.authUrl || '/myrw/widgets/my_widgets';

//     if (req.cookies.authUrl) {
//       res.clearCookie('authUrl');
//     }

//     return res.redirect(authRedirect);
//   },
// );

// Authenticate specific service, and set authUrl cookie so we remember where we where
// router.get('/auth/:service', (req, res) => {
//   const { service } = req.params;

//   // Returning user data
//   if (service === 'user') return res.json(req.user || {});

//   if (!/facebook|google|twitter/.test(service)) {
//     return res.redirect('/sign-in');
//   }

//   if (req.cookies.authUrl) {
//     res.clearCookie('authUrl');
//   }

//   // save the current url for redirect if successful, set it to expire in 5 min
//   res.cookie('authUrl', req.headers.referer, { maxAge: 3e5, httpOnly: true });
//   return res.redirect(
//     `${process.env.NEXT_PUBLIC_WRI_API_URL}/auth/${service}?callbackUrl=${
//       process.env.NEXT_PUBLIC_CALLBACK_URL
//     }&applications=rw&token=true&origin=rw`,
//   );
// });

// local sign-in
router.post('/local-sign-in', ((process.env.NODE_ENV === 'test' && process.env.TEST_ENV === 'FRONTEND') ? auth.mockSignIn : auth.signin));

// updates user data
router.post('/update-user', auth.updateUser);

module.exports = router;

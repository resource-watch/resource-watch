// routes.js

const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// ========================= ADMIN ROUTES =====================
routes.add('admin_home', '/admin', 'admin/data');

// ----- DATA --------
routes.add('admin_data', '/admin/data/:tab?/:subtab?', 'admin/Data');

// ----- PARTNERS --------
routes.add('admin_partners', '/admin/partners/:tab?/:subtab?', 'admin/partners');

// ----- PAGES --------
routes.add('admin_pages', '/admin/pages/:tab?/:subtab?', 'admin/pages');

// ----- USERS --------
routes.add('admin_users', '/admin/users/:tab?/:subtab?', 'admin/users');

// ----- LOGOUT --------
// routes.add('logout', '/admin/logout', '/');

// ========================= APP ROUTES =====================
routes.add('home', '/home', 'app/Home');
routes.add('about', '/about', 'app/About');
routes.add('data', '/data', 'app/Explore'); // TODO: create the data page
routes.add('explore', '/explore', 'app/Explore');
routes.add('explore_detail', '/explore/:id', 'app/ExploreDetail');
routes.add('about_partners', '/about_partners', 'app/Partners');
routes.add('pulse', '/pulse', 'app/Pulse');
routes.add('dashboards', '/home', 'app/dashboards');
routes.add('partner', '/about/partners/:id', 'app/PartnerDetail');
routes.add('insights', '/insights', 'app/Home');

// ----- GET INVOLVED -----
routes.add('get_involved', '/get-involved', 'app/GetInvolved');
routes.add('contribute_data', '/get-involved/contribute-data', 'app/ContributeData');
routes.add('join_community', '/get-involved/join-community', 'app/ContributeData');
routes.add('submit_insight', '/get-involved/submit-insight', 'app/SubmitInsight');
routes.add('develop_app', '/get-involved/develop-app', 'app/DevelopApp');
routes.add('apps', '/get-involved/apps', 'app/Apps');

// ------ MY RW ------------
routes.add('myrw', '/myrw/:tab?/:subtab?', 'app/MyRW');

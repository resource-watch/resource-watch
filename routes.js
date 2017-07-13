// routes.js
const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// ========================= ADMIN ROUTES =====================
routes.add('admin_home', '/admin', 'admin/Data');
// DATA
routes.add('admin_data', '/admin/data/:tab?', 'admin/Data');
routes.add('admin_data_detail', '/admin/data/:tab/:id/:subtab?', 'admin/DataDetail');
// PARTNERS
routes.add('admin_partners', '/admin/partners/:tab?/:subtab?', 'admin/partners');
// PAGES
routes.add('admin_pages', '/admin/pages/:tab?/:subtab?', 'admin/Pages');
routes.add('admin_pages_detail', '/admin/pages/:tab/:id/:subtab?', 'admin/PagesDetail');
// USERS
routes.add('admin_users', '/admin/users/:tab?/:subtab?', 'admin/users');

// ========================= APP ROUTES =====================
routes.add('home', '/', 'app/Home');

routes.add('about', '/about', 'app/About');
routes.add('about_partners', '/about/partners', 'app/Partners');
routes.add('partner', '/about/partners/:id', 'app/PartnerDetail');

// ----- DATA -----
// routes.add('data', '/data', 'app/Explore'); // TODO: create the data page
routes.add('explore', '/data/explore', 'app/Explore');
routes.add('explore_detail', '/data/explore/:id', 'app/ExploreDetail');

routes.add('pulse', '/data/pulse', 'app/Pulse');

routes.add('dashboards', '/data/dashboards/', 'app/Dashboards');
routes.add('dashboards_detail', '/data/dashboards/:slug', 'app/DashboardsDetail');

routes.add('insights', '/data/insights', 'app/Home'); // TODO: create the insights page

// ----- GET INVOLVED -----
routes.add('get_involved', '/get-involved', 'app/GetInvolved');
routes.add('get_involved_detail', '/get-involved/:id', 'app/GetInvolvedDetail');

// ------ MY RW ------------
routes.add('myrw', '/myrw/:tab?/:subtab?', 'app/MyRW');

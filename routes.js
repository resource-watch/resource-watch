// routes.js
const nextRoutes = require('next-routes');

const routes = nextRoutes();

// ========================= ADMIN ROUTES =====================
routes.add('admin_home', '/admin', 'admin/data');
// admin - data
routes.add('admin_data', '/admin/data/:tab?', 'admin/data');
routes.add('admin_data_detail', '/admin/data/:tab/:id/:subtab?', 'admin/data-detail');
// admin - dashboards
routes.add('admin_dashboards', '/admin/dashboards/:tab?', 'admin/dashboards');
routes.add('admin_dashboards_detail', '/admin/dashboards/:tab/:id/:subtab?', 'admin/dashboards-detail');
// admin - partners
routes.add('admin_partners', '/admin/partners/:tab?', 'admin/partners');
routes.add('admin_partners_detail', '/admin/partners/:tab/:id/:subtab?', 'admin/partners-detail');
// admin - pages
routes.add('admin_pages', '/admin/pages/:tab?', 'admin/pages');
routes.add('admin_pages_detail', '/admin/pages/:tab/:id/:subtab?', 'admin/pages-detail');
// admin - tools
routes.add('admin_tools', '/admin/tools/:tab?', 'admin/tools');
routes.add('admin_tools_detail', '/admin/tools/:tab/:id/:subtab?', 'admin/tools-detail');
// admin - faqs
routes.add('admin_faqs', '/admin/faqs/:tab?', 'admin/faqs');
routes.add('admin_faqs_detail', '/admin/faqs/:tab/:id/:subtab?', 'admin/faqs-detail');

// ========================= MY-RW ROUTES =====================
routes.add('myrw', '/myrw/:tab?/:subtab?', 'myrw');
routes.add('myrw_detail', '/myrw-detail/:tab?/:id?/:subtab?', 'myrw/detail');

// ========================= APP ROUTES =====================
routes.add('home', '/', '/'); // OK

// ---- ABOUT ----
routes.add('about', '/about', '/about'); // OK
routes.add('about_partners', '/about/partners', 'about/partners'); // OK
routes.add('partner', '/about/partners/:id', 'app/partner-detail'); // OK
routes.add('about_faqs', '/about/faqs', 'about/faqs'); // OK
routes.add('about_contact-us', '/about/contact-us', 'about/contact-us'); // OK
routes.add('about_howto', '/about/howto', 'about/howto'); // OK
routes.add('newsletter', '/about/newsletter', 'about/newsletter'); // OK
routes.add('newsletter-thank-you', '/about/newsletter-thank-you', 'about/newsletter-thank-you'); // OK

// ----- DATA -----
routes.add('explore', '/data/explore/:dataset?', '/data/explore'); // OK
routes.add('explore_embed', '/embed/data/explore/:dataset?', '/embed/data/explore'); // OK
routes.add('pulse', '/data/pulse', '/data/pulse'); // OK

// ----- DASHBOARDS -----
routes.add('dashboards', '/dashboards', 'app/dashboards'); // OK
routes.add('dashboards_detail', '/dashboards/:slug', 'app/dashboards-detail'); // OK

routes.add('widget_detail', '/data/widget/:id', 'app/widget-detail'); // OK

// SEARCH
routes.add('search', '/search', '/search'); // OK

// ----- GET INVOLVED -----
routes.add('get_involved', '/get-involved', '/get-involved'); // OK
routes.add('get_involved_detail', '/get-involved/:id', 'app/get-involved-detail'); // OK

// ------ TERMS && POLICY -------------
routes.add('terms-of-service', '/terms-of-service', '/terms-of-service'); // OK
routes.add('privacy-policy', '/privacy-policy', '/privacy-policy'); // OK
routes.add('attribution-requirements', '/api-attribution-requirements', '/attribution-requirements'); // OK

// ------- CATALOG -------------
routes.add('catalog', '/catalog', '/catalog'); // OK

// ------- USER MANAGEMENT  -------------
routes.add('sign-in', '/sign-in', 'sign-in'); // OK
routes.add('forgot-password', '/forgot-password', 'forgot-password'); // OK
routes.add('reset-password', '/reset-password/:tokenEmail?', 'app/reset-password'); // OK

// ------ EMBED -------------
routes.add('embed_widget', '/embed/widget/:id', 'app/embed/widget'); // OK
routes.add('embed_text', '/embed/text/:id', 'app/embed/text');
routes.add('embed_map', '/embed/map/:id', 'app/embed/map'); // OK
routes.add('embed_map_swipe', '/embed/map-swipe', 'app/embed/map-swipe'); // OK
routes.add('embed_embed', '/embed/embed/:id', 'app/embed/embed'); // OK
routes.add('embed_dataset', '/embed/dataset/:id', 'app/embed/dataset'); // OK
routes.add('embed_table', '/embed/table/:id', 'app/embed/table'); // OK
routes.add('embed_similar_datasets', '/embed/similar_datasets/:id', 'app/embed/similar-datasets'); // OK
routes.add('embed_dashboard', '/embed/dashboard/:slug', 'app/embed/dashboard'); // OK

// ------- WEBSHOT  -------------
routes.add('webshot', '/webshot/:id', '/webshot'); // OK

module.exports = routes;

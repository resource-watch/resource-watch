// routes.js
const nextRoutes = require('next-routes');

const routes = nextRoutes();

// ========================= ADMIN ROUTES =====================
routes.add('admin_home', '/admin', 'admin/Data');
// DATA
routes.add('admin_data', '/admin/data/:tab?', 'admin/Data');
routes.add('admin_data_detail', '/admin/data/:tab/:id/:subtab?', 'admin/DataDetail');
// DASHBOARDS
routes.add('admin_dashboards', '/admin/dashboards/:tab?', 'admin/Dashboards');
routes.add('admin_dashboards_detail', '/admin/dashboards/:tab/:id/:subtab?', 'admin/DashboardsDetail');
// TOPICS
routes.add('admin_topics', '/admin/topics/:tab?', 'admin/topics');
routes.add('admin_topics_detail', '/admin/topics/:tab/:id/:subtab?', 'admin/topics-detail');
// PARTNERS
routes.add('admin_partners', '/admin/partners/:tab?', 'admin/Partners');
routes.add('admin_partners_detail', '/admin/partners/:tab/:id/:subtab?', 'admin/PartnersDetail');
// PAGES
routes.add('admin_pages', '/admin/pages/:tab?', 'admin/Pages');
routes.add('admin_pages_detail', '/admin/pages/:tab/:id/:subtab?', 'admin/PagesDetail');
// TOOLS
routes.add('admin_tools', '/admin/tools/:tab?', 'admin/Tools');
routes.add('admin_tools_detail', '/admin/tools/:tab/:id/:subtab?', 'admin/ToolsDetail');
// PARTNERS
routes.add('admin_faqs', '/admin/faqs/:tab?', 'admin/Faqs');
routes.add('admin_faqs_detail', '/admin/faqs/:tab/:id/:subtab?', 'admin/FaqsDetail');

// ========================= APP ROUTES =====================
routes.add('home', '/', 'app/home');
routes.add('splash', '/splash', 'app/splash');
routes.add('splash_detail', '/splash/:id', 'app/splash-detail');

// ---- ABOUT ----
routes.add('about', '/about', 'app/about');
routes.add('about_partners', '/about/partners', 'app/partners');
routes.add('partner', '/about/partners/:id', 'app/partner-detail');
routes.add('about_faqs', '/about/faqs', 'app/faqs');
routes.add('about_contact-us', '/about/contact-us', 'app/contact-us');
routes.add('about_howto', '/about/howto', 'app/how-to');
routes.add('newsletter', '/about/newsletter', 'app/newsletter');

// ----- DATA -----
// routes.add('data', '/data', 'app/Explore'); // TODO: create the data page
routes.add('explore', '/data/explore', 'app/explore');
routes.add('explore_embed', '/embed/data/explore', 'app/explore/embed');

routes.add('explore_detail_private', '/data/explore/private/:id', 'app/explore-detail/private');
routes.add('explore_detail', '/data/explore/:id', 'app/explore-detail');

routes.add('pulse', '/data/pulse', 'app/pulse');

routes.add('dashboards', '/data/dashboards', 'app/dashboards');
routes.add('dashboards_detail', '/data/dashboards/:slug', 'app/dashboards-detail');

routes.add('widget_detail', '/data/widget/:id', 'app/widget-detail');

// SEARCH
routes.add('search', '/search', 'app/search');

// ----- TOPICS -----
routes.add('topics', '/topics', 'app/topics');
routes.add('topics_detail', '/topics/:id', 'app/topics-detail');

// ----- GET INVOLVED -----
routes.add('get_involved', '/get-involved', 'app/get-involved');
routes.add('get_involved_detail', '/get-involved/:id', 'app/get-involved-detail');

// ------ MY RW ------------
routes.add('myrw', '/myrw/:tab?/:subtab?', 'app/MyRW');
routes.add('myrw_detail', '/myrw-detail/:tab?/:id?/:subtab?', 'app/MyRWDetail');

// ------ TERMS && POLICY -------------
routes.add('terms-of-service', '/terms-of-service', 'app/terms-of-service');
routes.add('privacy-policy', '/privacy-policy', 'app/policy');
routes.add('attribution-requirements', '/api-attribution-requirements', 'app/attribution-requirements');

// ------- CATALOG -------------
routes.add('catalog', '/catalog', 'app/catalog');

// ------- USER MANAGEMENT  -------------
routes.add('sign-in', '/sign-in', 'app/sign-in');
routes.add('forgot-password', '/forgot-password', 'app/forgot-password');
routes.add('reset-password', '/reset-password/:tokenEmail?', 'app/reset-password');

// ------ EMBED -------------
routes.add('embed_widget', '/embed/widget/:id', 'app/embed/widget');
routes.add('embed_text', '/embed/text/:id', 'app/embed/text');
routes.add('embed_map', '/embed/map/:id', 'app/embed/map');
routes.add('embed_map_swipe', '/embed/map-swipe', 'app/embed/map-swipe');
routes.add('embed_embed', '/embed/embed/:id', 'app/embed/embed');
routes.add('embed_dataset', '/embed/dataset/:id', 'app/embed/EmbedDataset');
routes.add('embed_table', '/embed/table/:id', 'app/embed/table');
routes.add('embed_similar_datasets', '/embed/similar_datasets/:id', 'app/embed/similar-datasets');
routes.add('embed_dashboard', '/embed/dashboard/:slug', 'app/embed/EmbedDashboard');

// ------- WEBSHOT  -------------
routes.add('webshot', '/webshot/:id', 'app/webshot');

module.exports = routes;

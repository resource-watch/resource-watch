// routes.js

const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// ========================= ADMIN ROUTES =====================

// ----- DATASET --------
routes.add('admin_home', '/admin', 'admin/dataset');
routes.add('datasets', '/admin/datasets', 'admin/dataset');
routes.add('edit_dataset', '/admin/datasets/:id/edit', 'admin/dataset/edit');
routes.add('new_dataset', '/admin/datasets/new', 'admin/dataset/new');
// Metadata
routes.add('dataset_metadata', '/admin/datasets/:id/metadata', 'admin/dataset/metadata');
// Vocabularies
routes.add('dataset_vocabularies', '/admin/datasets/:id/dataset_vocabularies', 'admin/dataset/vocabularies');
// Widgets
routes.add('dataset_widgets', '/admin/datasets/:id/widgets', 'admin/widget');
routes.add('dataset_widgets_edit', '/admin/datasets/:id/widgets/:widget_id/edit', 'admin/widget/edit');
routes.add('dataset_widgets_new', '/admin/datasets/:id/widgets/new', 'admin/widget/new');

// ----- PARTNERS --------
routes.add('partners', '/admin/partners', 'admin/partners');
routes.add('new_partner', '/admin/partners/new', 'admin/partners/new');
routes.add('edit_partner', '/admin/partners/:id/edit', 'admin/partners/edit');

// ----- PAGES --------
routes.add('pages', '/admin/pages', 'admin/pages');
routes.add('new_page', '/admin/pages/new', 'admin/pages/new');
routes.add('edit_page', '/admin/pages/:id/edit', 'admin/pages/edit');

// ----- INSIGHTS --------
routes.add('insights', '/admin/insights', 'admin/insights');
routes.add('new_insight', '/admin/insights/new', 'admin/insights/new');
routes.add('edit_insight', '/admin/insights/:id/edit', 'admin/insights/edit');

// ----- VOCABULARIES --------
routes.add('vocabularies', '/admin/vocabularies', 'admin/vocabularies');

// ----- LOGOUT --------
// routes.add('logout', '/admin/logout', '/');

// ========================= APP ROUTES =====================

routes.add('home', '/home', 'app/Home');
routes.add('about', '/about', 'app/About');
routes.add('explore', '/explore', 'app/Explore');
routes.add('explore_detail', '/explore/:id', 'app/ExploreDetail');
routes.add('get_involved', '/get-involved', 'app/GetInvolved');
routes.add('about_partners', '/about_partners', 'app/Partners');
routes.add('pulse', '/pulse', 'app/Pulse');
routes.add('dashboards', '/home', 'app/dashboards');
routes.add('partner', '/about/partners/:id', 'app/PartnerDetail');
// ----- GET INVOLVED -----
routes.add('contribute_data', '/get-involved/contribute-data', 'app/ContributeData');
routes.add('join_community', '/get-involved/join-community', 'app/ContributeData');
routes.add('submit_insight', '/get-involved/submit-insight', 'app/SubmitInsight');
routes.add('develop_app', '/get-involved/develop-app', 'app/DevelopApp');

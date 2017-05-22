// routes.js

const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// ----- DATASET --------
routes.add('datasets', '/admin/datasets', 'dataset');
routes.add('edit_dataset', '/admin/datasets/:id/edit', 'dataset/edit');
routes.add('new_dataset', '/admin/datasets/new', 'dataset/new');
// Metadata
routes.add('dataset_metadata', '/admin/datasets/:id/metadata', 'dataset/metadata');
// Widgets
routes.add('dataset_widgets', '/admin/datasets/:id/widgets', 'widget');
routes.add('dataset_widgets_edit', '/admin/datasets/:id/widgets/:widget_id/edit', 'widget/edit');
routes.add('dataset_widgets_new', '/admin/datasets/:id/widgets/new', 'widget/new');

// ----- PARTNERS --------
routes.add('partners', '/admin/partners', 'partners');
routes.add('new_partner', '/admin/partners/new', 'partners/new');
routes.add('edit_partner', '/admin/partners/:id/edit', 'partners/edit');

// ----- PAGES --------
routes.add('pages', '/admin/pages', 'pages');
routes.add('new_page', '/admin/pages/new', 'pages/new');
routes.add('edit_page', '/admin/pages/:id/edit', 'pages/edit');

// ----- INSIGHTS --------
routes.add('insights', '/admin/insights', 'insights');
routes.add('new_insight', '/admin/insights/new', 'insights/new');
routes.add('edit_insight', '/admin/insights/:id/edit', 'insights/edit');

// ----- VOCABULARIES --------
routes.add('vocabularies', '/admin/vocabularies', 'vocabularies');

// ----- LOGOUT --------
routes.add('logout', '/admin/logout', 'dataset');

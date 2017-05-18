// routes.js

const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// ----- DATASET --------
routes.add('datasets', '/admin/datasets', 'dataset');
routes.add('edit_dataset', '/admin/datasets/:id/edit', 'dataset/edit');
routes.add('new_dataset', '/admin/datasets/new', 'dataset/new');
routes.add('dataset_widgets', '/admin/datasets/:id/widgets', 'widget');

// ----- PARTNERS --------
routes.add('partners', '/admin/partners', 'dataset');

// ----- PAGES --------
routes.add('pages', '/admin/pages', 'pages');

// ----- INSIGHTS --------
routes.add('insights', '/admin/insights', 'insights');

// ----- VOCABULARIES --------
routes.add('vocabularies', '/admin/vocabularies', 'vocabularies');

// ----- LOGOUT --------
routes.add('logout', '/admin/logout', 'dataset');

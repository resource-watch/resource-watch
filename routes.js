// routes.js

const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// ----- DATASET --------
routes.add('datasets', '/admin/datasets', 'dataset');
routes.add('edit_dataset', '/admin/datasets/:id/edit', 'dataset/edit');
routes.add('new_dataset', '/admin/datasets/new', 'dataset/new');

// ----- PARTNERS --------
routes.add('partners', '/admin/datasets', 'dataset');

// ----- PAGES --------
routes.add('pages', '/admin/datasets', 'dataset');

// ----- INSIGHTS --------
routes.add('insights', '/admin/datasets', 'dataset');

// ----- VOCABULARIES --------
routes.add('vocabularies', '/admin/datasets', 'dataset');

// ----- LOGOUT --------
routes.add('logout', '/admin/datasets', 'dataset');

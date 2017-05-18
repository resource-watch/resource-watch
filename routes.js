// routes.js

const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// -----DATASET ROUTES--------
routes.add('datasets', '/admin/datasets', 'dataset');
routes.add('edit_dataset', '/admin/datasets/:id/edit', 'dataset/edit');
routes.add('new_dataset', '/admin/datasets/new', 'dataset/new');

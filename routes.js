// routes.js

const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// -----DATASET ROUTES--------
routes.add('datasets', '/datasets', 'dataset');
routes.add('edit_dataset', '/datasets/:id/edit', 'dataset/edit');

import { handleModule } from 'redux-tools';

import dashboardsModule from './dashboards';
import staticPagesModules from './static-pages';
import topicsModule from './topics';

export default {
  dashboards: handleModule(dashboardsModule),
  staticPages: handleModule(staticPagesModules),
  topics: handleModule(topicsModule)
};


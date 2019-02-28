import { handleModule } from 'redux-tools';

import dashboardsModule from './dashboards';
import partnersModule from './partners';
import staticPagesModules from './static-pages';
import topicsModule from './topics';

export default {
  dashboards: handleModule(dashboardsModule),
  partners: handleModule(partnersModule),
  staticPages: handleModule(staticPagesModules),
  topics: handleModule(topicsModule)
};


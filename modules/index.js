import { handleModule } from 'redux-tools';

import dashboardsModule from './dashboards';
import partnersModule from './partners';
import staticPagesModules from './static-pages';

export default {
  dashboards: handleModule(dashboardsModule),
  partners: handleModule(partnersModule),
  staticPages: handleModule(staticPagesModules)
};


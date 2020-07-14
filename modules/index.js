import { handleModule } from 'redux-tools';

import blogModule from './blog';
import dashboardsModule from './dashboards';
import partnersModule from './partners';
import staticPagesModules from './static-pages';

export default {
  blog: handleModule(blogModule),
  dashboards: handleModule(dashboardsModule),
  partners: handleModule(partnersModule),
  staticPages: handleModule(staticPagesModules)
};


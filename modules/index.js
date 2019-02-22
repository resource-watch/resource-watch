import { handleModule } from 'redux-tools';

import dashboardsModule from './dashboards';
import topicsModule from './topics';

export default {
  dashboards: handleModule(dashboardsModule),
  topics: handleModule(topicsModule)
};


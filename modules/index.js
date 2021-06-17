import blogReducer from './blog/reducers';
import dashboardsReducer from './dashboards/reducers';
import partnersReducer from './partners/reducers';
import staticPagesReducer from './static-pages/reducers';
import exploreReducer from './explore';

export default {
  blog: blogReducer,
  dashboards: dashboardsReducer,
  partners: partnersReducer,
  staticPages: staticPagesReducer,
  explore: exploreReducer,
};

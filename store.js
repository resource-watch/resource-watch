import initOpbeat from 'opbeat-react';
import { createOpbeatMiddleware } from 'opbeat-react/redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import * as reducers from 'redactions';

// New modules
import { handleModule } from 'redux-tools';

// Layout
import * as header from 'components/layout/header';
import * as headerAdmin from 'components/layout/header-admin';
import * as footer from 'components/layout/footer';

// Search
import * as search from 'pages/app/search/search';

// Share
import * as shareModal from 'components/modal/share-modal';

// Dashboard
import * as dashboardDetail from 'components/dashboards/detail/dashboard-detail';
import * as dashboardThumbnailList from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list';
import * as widgetBlockModule from 'components/wysiwyg/widget-block/widget-block';
import * as widgetBlockEditionModule from 'components/wysiwyg/widget-block-edition/widget-block-edition';

// Dataset
import * as similarDatasets from 'components/datasets/similar-datasets/similar-datasets';
import * as trySubscriptionModal from 'components/datasets/form/try-subscription-modal';

// Explore
import * as exploreDetail from 'pages/app/explore-detail/explore-detail';
import * as exploreDatasetFilters from 'components/app/explore/explore-dataset-filters/explore-dataset-filters';

// Widget
import * as widgetDetail from 'pages/app/widget-detail/widget-detail';

// Topic
import * as topicsIndex from 'pages/app/topics/topics';
import * as topicsDetail from 'pages/app/topics-detail/topics-detail';
import * as topicThumbnailList from 'components/topics/thumbnail-list';

// Admin Interactions
import * as adminInteractions from 'components/admin/layers/form/interactions';
import * as adminLayerPreview from 'components/admin/layers/form/layer-preview';

// Admin pages
import * as adminDataPage from 'pages/admin/data/data-details';

// Widget editor
import { reducers as widgetEditorModules } from 'widget-editor';

// React responsive redux
import { reducer as responsiveReducer } from 'react-responsive-redux';

if (process.env.NODE_ENV === 'production') {
  initOpbeat({
    orgId: '17ab8eb501d2418a81f3167c10407e90',
    appId: '7170680c2a'
  });
}

// REDUCERS
const reducer = combineReducers({
  ...reducers,

  // widgetEditor
  ...widgetEditorModules,

  // React responsive
  responsive: responsiveReducer,

  // Header
  header: handleModule(header),
  headerAdmin: handleModule(headerAdmin),
  footer: handleModule(footer),

  // Search
  search: handleModule(search),

  // Share
  shareModal: handleModule(shareModal),

  // Dashboards
  dashboardDetail: handleModule(dashboardDetail),
  dashboardThumbnailList: handleModule(dashboardThumbnailList),
  widgetBlock: handleModule(widgetBlockModule),
  widgetBlockEdition: handleModule(widgetBlockEditionModule),

  // Explore
  exploreDetail: handleModule(exploreDetail),
  exploreDatasetFilters: handleModule(exploreDatasetFilters),

  // Dataset
  similarDatasets: handleModule(similarDatasets),
  trySubscriptionModal: handleModule(trySubscriptionModal),

  // Widget
  widgetDetail: handleModule(widgetDetail),

  // Admin pages
  adminDataPage: handleModule(adminDataPage),

  // Topic
  topicsIndex: handleModule(topicsIndex),
  topicsDetail: handleModule(topicsDetail),
  topicThumbnailList: handleModule(topicThumbnailList),

  // Admin interactions
  interactions: handleModule(adminInteractions),

  // Admin layer preview
  adminLayerPreview: handleModule(adminLayerPreview)
});

const composeEnhancers = composeWithDevTools({});

export const initStore = (initialState = {}) => createStore(
  reducer,
  initialState,
  composeEnhancers(
    /* The router middleware MUST be before thunk otherwise the URL changes
    * inside a thunk function won't work properly */
    applyMiddleware(thunk, createOpbeatMiddleware())
  )
);

import initOpbeat from 'opbeat-react';
import { createOpbeatMiddleware } from 'opbeat-react/redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import * as reducers from 'redactions';

// New modules
import { handleModule } from 'redux-tools';

// Layout
import * as header from 'layout/header';
import * as headerAdmin from 'layout/header-admin';
import * as footer from 'layout/footer';

// Search
import * as search from 'layout/search';

// Share
import * as shareModal from 'components/modal/share-modal';

// Dashboard
import * as dashboardDetail from 'components/dashboards/detail/dashboard-detail';
import * as dashboardThumbnailList from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list';
import * as widgetBlockModule from 'components/wysiwyg/widget-block/widget-block';
import * as widgetBlockEditionModule from 'components/wysiwyg/widget-block-edition/widget-block-edition';

// Dataset
import * as datasetListItem from 'components/datasets/list/list-item';
import * as similarDatasets from 'components/datasets/similar-datasets/similar-datasets';
import * as trySubscriptionModal from 'components/datasets/form/try-subscription-modal';

// Explore
import * as explore from 'layout/explore';

// Explore detail
import * as exploreDetail from 'layout/explore-detail';
import * as exploreDatasetFilters from 'components/app/explore/explore-dataset-filters/explore-dataset-filters';

// Pulse
import * as pulse from 'layout/pulse';
import * as layerMenuDropdown from 'layout/pulse/layer-menu-dropdown';
import * as layerCard from 'layout/pulse/layer-card';
import * as layerPill from 'layout/pulse/layer-pill';
import * as globeCesium from 'components/vis/globe-cesium';

// Widget
import * as widgetDetail from 'layout/widget-detail';

// Catalog

import * as catalog from 'layout/catalog';

// Topic
import * as topicsIndex from 'layout/topics';
import * as topicsDetail from 'layout/topics-detail';
import * as topicThumbnailList from 'components/topics/thumbnail-list';

// Admin Interactions
import * as adminInteractions from 'components/admin/layers/form/interactions';
import * as adminLayerPreview from 'components/admin/layers/form/layer-preview';

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
  explore: handleModule(explore),
  exploreDetail: handleModule(exploreDetail),
  exploreDatasetFilters: handleModule(exploreDatasetFilters),

  // Pulse
  layerMenuPulse: handleModule(layerMenuDropdown),
  layerCardPulse: handleModule(layerCard),
  contextLayersPulse: handleModule(layerPill),
  globeCesium: handleModule(globeCesium),
  pulse: handleModule(pulse),

  // Dataset
  datasetListItem: handleModule(datasetListItem),
  similarDatasets: handleModule(similarDatasets),
  trySubscriptionModal: handleModule(trySubscriptionModal),

  // Widget
  widgetDetail: handleModule(widgetDetail),

  // Catalog
  catalog: handleModule(catalog),

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
    applyMiddleware(thunk, createOpbeatMiddleware()))
);

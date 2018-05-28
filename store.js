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

// Tools
import * as relatedTools from 'components/tools/related-tools';

// Explore
import * as explore from 'layout/explore';

// Explore detail
import * as exploreDetail from 'layout/explore-detail';

// Pulse
import * as pulse from 'layout/pulse';
import * as layerContainer from 'layout/pulse/layer-container';
import * as layerMenu from 'layout/pulse/layer-menu';
import * as layerCard from 'layout/pulse/layer-card';
import * as layerPill from 'layout/pulse/layer-pill';
import * as labelsPill from 'layout/pulse/labels-pill';
import * as globeCesium from 'components/vis/globe-cesium';

// Widget
import * as widgetDetail from 'layout/widget-detail';

// Catalog
import * as catalog from 'layout/catalog';

// Blog
import * as latestBlogPosts from 'components/blog/latest-posts';

// Topic
import * as topics from 'redactions/topics';
import * as topicsIndex from 'layout/topics';
import * as topicsDetail from 'layout/topics-detail';
import * as topicThumbnailList from 'components/topics/thumbnail-list';

// Get Involved
import * as getInvolvedIndex from 'layout/get-involved';
import * as getInvolvedDetail from 'layout/get-involved-detail';

// Admin Interactions
import * as adminInteractions from 'components/admin/layers/form/interactions';
import * as adminLayerPreview from 'components/admin/layers/form/layer-preview';

// Widget editor
import { reducers as widgetEditorModules } from 'widget-editor';

// React responsive redux
import { reducer as responsiveReducer } from 'react-responsive-redux';

// Embed
import * as embedMapSwipe from 'layout/embed/map-swipe';

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

  // Pulse
  layerContainerPulse: handleModule(layerContainer),
  layerMenuPulse: handleModule(layerMenu),
  layerCardPulse: handleModule(layerCard),
  contextLayersPulse: handleModule(layerPill),
  labelsPulse: handleModule(labelsPill),
  globeCesium: handleModule(globeCesium),
  pulse: handleModule(pulse),

  // Dataset
  datasetListItem: handleModule(datasetListItem),
  similarDatasets: handleModule(similarDatasets),
  trySubscriptionModal: handleModule(trySubscriptionModal),

  // Tools
  relatedTools: handleModule(relatedTools),

  // Widget
  widgetDetail: handleModule(widgetDetail),

  // Catalog
  catalog: handleModule(catalog),

  // Blog
  latestBlogPosts: handleModule(latestBlogPosts),

  // Topic
  topics: handleModule(topics),
  topicsIndex: handleModule(topicsIndex),
  topicsDetail: handleModule(topicsDetail),
  topicThumbnailList: handleModule(topicThumbnailList),

  // Get Involved
  getInvolvedIndex: handleModule(getInvolvedIndex),
  getInvolvedDetail: handleModule(getInvolvedDetail),

  // Admin interactions
  interactions: handleModule(adminInteractions),

  // Admin layer preview
  adminLayerPreview: handleModule(adminLayerPreview),

  // Embed
  embedMapSwipe: handleModule(embedMapSwipe)
});

const composeEnhancers = composeWithDevTools({});

export const initStore = (initialState = {}) => createStore(
  reducer,
  initialState,
  composeEnhancers(
    /* The router middleware MUST be before thunk otherwise the URL changes
    * inside a thunk function won't work properly */
    applyMiddleware(thunk))
);

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import { handleModule } from 'redux-tools';

// TO-DO: move redactions to modules
import * as reducers from 'redactions';
import modules from 'modules';

// Layout
import * as header from 'layout/header';
import * as headerAdmin from 'layout/header-admin';

// Search
import * as search from 'layout/search';

// Share
import * as shareModal from 'components/modal/share-modal';

// Dashboard
import * as widgetBlockModule from 'components/wysiwyg/widget-block/widget-block';
import * as widgetBlockEditionModule from 'components/wysiwyg/widget-block-edition/widget-block-edition';

// Dataset
import * as datasetListItem from 'components/datasets/list/list-item';
import * as similarDatasets from 'components/datasets/similar-datasets/similar-datasets';
import * as trySubscriptionModal from 'components/datasets/form/try-subscription-modal';

// subscriptions
import * as subscriptions from 'components/modal/subscriptions-modal';

// Tools
import * as relatedTools from 'components/tools/related-tools';

// Explore
import * as explore from 'layout/explore';

// Explore detail
import * as exploreDetail from 'layout/explore-detail';

// Pulse
import * as pulse from 'layout/app/pulse';
import * as layerContainer from 'layout/app/pulse/layer-container';
import * as layerMenu from 'layout/app/pulse/layer-menu';
import * as layerCard from 'layout/app/pulse/layer-card';
import * as layerPill from 'layout/app/pulse/layer-pill';
import * as labelsPill from 'layout/app/pulse/labels-pill';
import * as globeCesium from 'components/vis/globe-cesium';

// Get Involved
import * as getInvolvedIndex from 'layout/get-involved';
import * as getInvolvedDetail from 'layout/get-involved-detail';

// Admin Interactions
import * as adminInteractions from 'components/admin/data/layers/form/interactions';
import * as adminLayerPreview from 'components/admin/data/layers/form/layer-preview';

// Widget editor
import { reducers as widgetEditorModules } from 'widget-editor';

// React responsive redux
import { reducer as responsiveReducer } from 'react-responsive-redux';

// Embed
import * as embedMapSwipe from 'layout/embed/map-swipe';

// REDUCERS
const reducer = combineReducers({
  ...reducers,
  ...modules,

  // widgetEditor
  ...widgetEditorModules,

  // React responsive
  responsive: responsiveReducer,

  // Header
  header: handleModule(header),
  headerAdmin: handleModule(headerAdmin),

  // Search
  search: handleModule(search),

  // Share
  shareModal: handleModule(shareModal),

  // Dashboards
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

  // subscriptions
  subscriptions: handleModule(subscriptions),

  // Tools
  relatedTools: handleModule(relatedTools),

  // Catalog
  catalog: handleModule(catalog),

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

export const initStore = (initialState = {}) => createStore(
  reducer,
  initialState,
  composeWithDevTools(
    /* The router middleware MUST be before thunk otherwise the URL changes
    * inside a thunk function won't work properly */
    applyMiddleware(thunk)
  )
);

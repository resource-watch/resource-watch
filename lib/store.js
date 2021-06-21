import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';
import thunk from 'redux-thunk';
import {
  handleModule,
} from 'redux-tools';
import {
  reducers as WEReducers,
  middleware as WEmiddleware,
  sagas,
} from '@widget-editor/widget-editor';

// todo: move redactions to modules
import * as reducers from 'redactions';
import modules from 'modules';

// Layout
import {
  reducers as headerReducers,
  initialState as headerInitialState,
} from 'layout/header';
import {
  reducers as headerAdminReducers,
  initialState as headerAdminInitialState,
} from 'layout/header-admin/index';

// Search
import {
  reducers as searchReducers,
  initialState as searchInitialState,
} from 'layout/search';

// Share
import {
  reducers as shareModalReducers,
  initialState as shareModalInitialState,
} from 'components/modal/share-modal';

// Dashboard
import {
  reducers as widgetBlockReducers,
  initialState as widgetBlockInitialState,
} from 'components/wysiwyg/widget-block';

// Dataset
import {
  reducers as datasetListItemReducers,
  initialState as datasetListItemInitialState,
} from 'components/datasets/list/list-item';
import {
  reducers as similarDatasetsReducers,
  initialState as similarDatasetsInitialState,
} from 'components/datasets/similar-datasets/similar-datasets';
import {
  reducers as trySubscriptionModalReducers,
  initialState as trySubscriptionModalInitialState,
} from 'components/datasets/form/try-subscription-modal';

// subscriptions
import {
  reducers as subscriptionModalReducers,
  initialState as subscriptionModalInitialState,
} from 'components/modal/subscriptions-modal';

// Tools
import {
  reducers as relatedToolsReducers,
  initialState as relatedToolsInitialState,
} from 'components/tools/related-tools';

// Pulse
import {
  reducers as pulseReducers,
  initialState as pulseInitialState,
} from 'layout/app/pulse';
import {
  reducers as layerContainerReducers,
  initialState as layerContainerInitialState,
} from 'layout/app/pulse/layer-container';
import {
  reducers as layerMenuReducers,
  initialState as layerMenuInitialState,
} from 'layout/app/pulse/layer-menu';
import {
  reducers as layerCardReducers,
  initialState as layerCardInitialState,
} from 'layout/app/pulse/layer-card';
import {
  reducers as layerPillReducers,
  initialState as layerPillInitialState,
} from 'layout/app/pulse/layer-pill';
import {
  reducers as labelsPillsReducers,
  initialState as labelsPillsInitialState,
} from 'layout/app/pulse/labels-pill';
import {
  reducers as globeCesiumReducers,
  initialState as globeCesiumInitialState,
} from 'components/vis/globe-cesium';

// Get Involved
import {
  reducers as getInvolvedReducers,
  initialState as getInvolvedInitialState,
} from 'layout/get-involved';
import {
  reducers as getInvolvedDetailReducers,
  initialState as getInvolvedDetailInitialState,
} from 'layout/get-involved-detail';

// Admin Interactions
import {
  reducers as adminInteractionsDetailReducers,
  initialState as adminInteractionsInitialState,
} from 'components/admin/data/layers/form/interactions';
import {
  reducers as adminLayerPreviewReducers,
  initialState as adminLayerPreviewInitialState,
} from 'components/admin/data/layers/form/layer-preview';

// REDUCERS
const reducer = combineReducers({
  ...reducers,
  ...WEReducers,
  ...modules,

  // Header
  header: handleModule({
    reducers: headerReducers,
    initialState: headerInitialState,
  }),
  headerAdmin: handleModule({
    reducers: headerAdminReducers,
    initialState: headerAdminInitialState,
  }),

  // Search
  search: handleModule({
    reducers: searchReducers,
    initialState: searchInitialState,
  }),

  // Share
  shareModal: handleModule({
    reducers: shareModalReducers,
    initialState: shareModalInitialState,
  }),

  // Dashboards
  widgetBlock: handleModule({
    reducers: widgetBlockReducers,
    initialState: widgetBlockInitialState,
  }),

  // Pulse
  layerContainerPulse: handleModule({
    reducers: layerContainerReducers,
    initialState: layerContainerInitialState,
  }),
  layerMenuPulse: handleModule({
    reducers: layerMenuReducers,
    initialState: layerMenuInitialState,
  }),
  layerCardPulse: handleModule({
    reducers: layerCardReducers,
    initialState: layerCardInitialState,
  }),
  contextLayersPulse: handleModule({
    reducers: layerPillReducers,
    initialState: layerPillInitialState,
  }),
  labelsPulse: handleModule({
    reducers: labelsPillsReducers,
    initialState: labelsPillsInitialState,
  }),
  globeCesium: handleModule({
    reducers: globeCesiumReducers,
    initialState: globeCesiumInitialState,
  }),
  pulse: handleModule({
    reducers: pulseReducers,
    initialState: pulseInitialState,
  }),

  // Dataset
  datasetListItem: handleModule({
    reducers: datasetListItemReducers,
    initialState: datasetListItemInitialState,
  }),
  similarDatasets: handleModule({
    reducers: similarDatasetsReducers,
    initialState: similarDatasetsInitialState,
  }),
  trySubscriptionModal: handleModule({
    reducers: trySubscriptionModalReducers,
    initialState: trySubscriptionModalInitialState,
  }),

  // subscriptions
  subscriptions: handleModule({
    reducers: subscriptionModalReducers,
    initialState: subscriptionModalInitialState,
  }),

  // Tools
  relatedTools: handleModule({
    reducers: relatedToolsReducers,
    initialState: relatedToolsInitialState,
  }),

  // Get Involved
  getInvolvedIndex: handleModule({
    reducers: getInvolvedReducers,
    initialState: getInvolvedInitialState,
  }),
  getInvolvedDetail: handleModule({
    reducers: getInvolvedDetailReducers,
    initialState: getInvolvedDetailInitialState,
  }),

  // Admin interactions
  interactions: handleModule({
    reducers: adminInteractionsDetailReducers,
    initialState: adminInteractionsInitialState,
  }),

  // Admin layer preview
  adminLayerPreview: handleModule({
    reducers: adminLayerPreviewReducers,
    initialState: adminLayerPreviewInitialState,
  }),
});

export default function initStore(initialState = {}) {
  const middlewares = applyMiddleware(thunk, WEmiddleware);
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(middlewares),
  );

  WEmiddleware.run(sagas);

  return store;
}

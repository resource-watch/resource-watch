import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { createWrapper } from 'next-redux-wrapper';
import { handleModule } from 'redux-tools';
import {
  reducers as WEReducers,
  middleware as WEmiddleware,
  sagas,
} from '@widget-editor/widget-editor';

// todo: move redactions to modules
import * as reducers from 'redactions';
import modules from 'modules';

// Layout
import { reducers as headerReducers, initialState as headerInitialState } from 'layout/header';
import {
  reducers as headerAdminReducers,
  initialState as headerAdminInitialState,
} from 'layout/header-admin/index';

// Share
import {
  reducers as shareModalReducers,
  initialState as shareModalInitialState,
} from 'components/modal/share-modal';

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

// Get Involved
import { getInvolvedIndexReducer } from 'layout/get-involved';
import { getInvolvedDetailReducer } from 'layout/get-involved-detail';

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

  // Share
  shareModal: handleModule({
    reducers: shareModalReducers,
    initialState: shareModalInitialState,
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
  getInvolvedIndex: getInvolvedIndexReducer,
  getInvolvedDetail: getInvolvedDetailReducer,

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

function initStore() {
  const middlewares = applyMiddleware(thunk, WEmiddleware);
  const composeEnhancers =
    (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store = createStore(reducer, composeEnhancers(middlewares));

  WEmiddleware.run(sagas);

  return store;
}

export default createWrapper(initStore);

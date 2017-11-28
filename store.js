import initOpbeat from 'opbeat-react';
import { createOpbeatMiddleware } from 'opbeat-react/redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import * as reducers from 'redactions';

// New modules
import { handleModule } from 'redux-actions';
import * as dashboardDetail from 'components/dashboards/detail/dashboard-detail';
import * as widgetBlockEditionModule from 'components/dashboards/wysiwyg/widget-block-edition/widget-block-edition';

if (process.env.NODE_ENV === 'production') {
  initOpbeat({
    orgId: '17ab8eb501d2418a81f3167c10407e90',
    appId: '7170680c2a'
  });
}


// REDUCERS
const reducer = combineReducers({
  ...reducers,
  dashboardDetail: handleModule(dashboardDetail),
  widgetBlockEdition: handleModule(widgetBlockEditionModule)
});

export const initStore = (initialState = {}) => createStore(
  reducer,
  initialState,
  composeWithDevTools(
    /* The router middleware MUST be before thunk otherwise the URL changes
    * inside a thunk function won't work properly */
    applyMiddleware(thunk, createOpbeatMiddleware())
  )
);

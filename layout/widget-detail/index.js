// Redux
import { connect } from 'react-redux';
import * as actions from './widget-detail-actions';
import * as reducers from './widget-detail-reducers';
import initialState from './widget-detail-default-state';

import WidgetDetailComponent from './widget-detail-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    widgetDetail: state.widgetDetail
  }),
  actions
)(WidgetDetailComponent);

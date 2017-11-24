import { connect } from 'react-redux';
import * as actions from './dashboard-detail-actions';
import reducers from './dashboard-detail-reducers';
import defaultState from './dashboard-detail-default-state';

import DashboardDetail from './dashboard-detail-component';

// Mandatory
export {
  actions, reducers, defaultState
};

export default connect(
  state => ({
    dashboardDetail: state.dashboardDetail
  }),
  actions
)(DashboardDetail);

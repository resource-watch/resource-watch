// Redux
import { connect } from 'react-redux';
import * as actions from './get-involved-detail-actions';
import * as reducers from './get-involved-detail-reducers';
import initialState from './get-involved-detail-default-state';

import GetInvolvedDetailComponent from './get-involved-detail-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    getInvolvedDetail: state.getInvolvedDetail,
    user: state.user
  }),
  actions
)(GetInvolvedDetailComponent);

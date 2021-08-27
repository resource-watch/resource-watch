// Redux
import { connect } from 'react-redux';
import * as actions from './get-involved-detail-actions';
import getInvolvedDetailReducer from './get-involved-detail-reducers';
import initialState from './get-involved-detail-default-state';

import GetInvolvedDetailComponent from './get-involved-detail-component';

// Mandatory
export {
  actions,
  getInvolvedDetailReducer,
  initialState,
};

export default connect(
  (state) => ({
    getInvolvedDetail: state.getInvolvedDetail,
  }),
  actions,
)(GetInvolvedDetailComponent);

// Redux
import { connect } from 'react-redux';
import * as actions from './get-involved-actions';
import * as reducers from './get-involved-reducers';
import initialState from './get-involved-default-state';

import GetInvolvedComponent from './get-involved-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    getInvolvedIndex: state.getInvolvedIndex,
    user: state.user
    // insights: state.insights.list
  }),
  actions
)(GetInvolvedComponent);

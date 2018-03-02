// Redux
import { connect } from 'react-redux';
import * as actions from './data-actions';
import * as reducers from './data-reducer';
import initialState from './data-default-state';

import DataComponent from './data-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    adminDataPage: state.adminDataPage,
    user: state.user
  }),
  actions
)(DataComponent);

import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import InteractionsComponent from './component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    dashboardDetail: state.InteractionsComponent
  }),
  actions
)(InteractionsComponent);

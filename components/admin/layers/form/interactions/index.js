import { connect } from 'react-redux';
import * as actions from './interactions-actions';
import * as reducers from './interactions-reducer';
import initialState from './interactions-default-state';

import InteractionsComponent from './interactions-component';

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

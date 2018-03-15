import { connect } from 'react-redux';
import * as actions from './header-admin-actions';
import * as reducers from './header-admin-reducers';
import initialState from './header-admin-default-state';

import HeaderComponent from './header-admin-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    pageHeader: true,
    header: state.headerAdmin,
    routes: state.routes,
    user: state.user,
    responsive: state.responsive
  }),
  actions
)(HeaderComponent);

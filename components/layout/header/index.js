import { connect } from 'react-redux';
import * as actions from './header-actions';
import * as reducers from './header-reducers';
import initialState from './header-default-state';

import HeaderComponent from './header-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    header: state.header,
    routes: state.routes,
    user: state.user,
    responsive: state.responsive
  }),
  actions
)(HeaderComponent);

import { connect } from 'react-redux';
import * as actions from '../header-admin-actions';

import HeaderUserComponent from './header-admin-user-component';

export default connect(
  state => ({
    header: state.headerAdmin,
    user: state.user,
    routes: state.routes
  }),
  actions
)(HeaderUserComponent);

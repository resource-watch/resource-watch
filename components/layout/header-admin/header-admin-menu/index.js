import { connect } from 'react-redux';
import * as actions from '../header-admin-actions';

import HeaderMenuComponent from './header-admin-menu-component';

export default connect(
  state => ({
    header: state.headerAdmin,
    routes: state.routes
  }),
  actions
)(HeaderMenuComponent);

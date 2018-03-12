import { connect } from 'react-redux';
import * as actions from '../header-admin-actions';

import HeaderMenuMobileComponent from './header-admin-menu-mobile-component';

export default connect(
  state => ({
    header: state.headerAdmin,
    routes: state.routes
  }),
  actions
)(HeaderMenuMobileComponent);

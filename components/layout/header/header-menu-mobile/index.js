import { connect } from 'react-redux';
import * as actions from '../header-actions';

import HeaderMenuMobileComponent from './header-menu-mobile-component';

export default connect(
  state => ({
    header: state.header,
    routes: state.routes
  }),
  actions
)(HeaderMenuMobileComponent);

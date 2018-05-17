import { connect } from 'react-redux';
import * as actions from '../header-actions';

import HeaderMenuMobileComponent from './component';

export default connect(
  state => ({
    header: state.header,
    user: state.user,
    routes: state.routes
  }),
  actions
)(HeaderMenuMobileComponent);

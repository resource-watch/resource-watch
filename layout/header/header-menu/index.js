import { connect } from 'react-redux';
import * as actions from '../header-actions';

import HeaderMenuComponent from './component';

export default connect(
  state => ({
    header: state.header,
    routes: state.routes
  }),
  actions
)(HeaderMenuComponent);

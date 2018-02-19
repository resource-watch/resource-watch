import { connect } from 'react-redux';
import * as actions from '../header-actions';

import HeaderSearchComponent from './header-search-component';

export default connect(
  state => ({
    header: state.header,
    routes: state.routes
  }),
  actions
)(HeaderSearchComponent);

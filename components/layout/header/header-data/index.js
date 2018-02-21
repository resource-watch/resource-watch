import { connect } from 'react-redux';
import * as actions from '../header-actions';

import HeaderDataComponent from './header-data-component';

export default connect(
  state => ({
    header: state.header
  }),
  actions
)(HeaderDataComponent);

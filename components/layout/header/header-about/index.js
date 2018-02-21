import { connect } from 'react-redux';
import * as actions from '../header-actions';

import HeaderAboutComponent from './header-about-component';

export default connect(
  state => ({
    header: state.header
  }),
  actions
)(HeaderAboutComponent);

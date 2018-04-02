import { connect } from 'react-redux';
import * as actions from '../header-actions';

import HeaderGetInvolvedComponent from './component';

export default connect(
  state => ({
    header: state.header
  }),
  actions
)(HeaderGetInvolvedComponent);

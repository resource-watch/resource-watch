import { connect } from 'react-redux';
import * as actions from './footer-actions';
import * as reducers from './footer-reducers';
import initialState from './footer-default-state';

import FooterComponent from './footer-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    footer: state.footer
  }),
  actions
)(FooterComponent);

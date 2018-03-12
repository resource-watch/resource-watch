import { connect } from 'react-redux';

import * as actions from './try-subscription-modal-actions';
import * as reducers from './try-subscription-modal-reducers';
import initialState from './try-subscription-modal-initial-state';

import TrySubscriptionModalComponent from './try-subscription-modal-component';

export { actions, reducers, initialState };

export default connect(
  state => ({
    ...state.trySubscriptionModal
  }),
  actions
)(TrySubscriptionModalComponent);

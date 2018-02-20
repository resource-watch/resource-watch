import { connect } from 'react-redux';
import * as actions from './share-modal-actions';
import * as reducers from './share-modal-reducers';
import initialState from './share-modal-default-state';

import ShareModalComponent from './share-modal-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    ...state.shareModal
  }),
  actions
)(ShareModalComponent);

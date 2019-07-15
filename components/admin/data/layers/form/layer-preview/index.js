import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

import LayerPreviewComponent from './component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    user: state.user,
    adminLayerPreview: state.adminLayerPreview,
    interactions: state.interactions
  }),
  actions
)(LayerPreviewComponent);

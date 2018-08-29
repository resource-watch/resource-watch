import { connect } from 'react-redux';
import * as actions from './layer-preview-actions';
import * as reducers from './layer-preview-reducer';
import initialState from './layer-preview-default-state';

import LayerPreviewComponent from './layer-preview-component';

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

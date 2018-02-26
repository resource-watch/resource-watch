import { connect } from 'react-redux';
import * as actions from './layer-preview-actions';
import * as reducers from './layer-preview-reducer';
import { initialState } from './layer-preview-reducer';

import LayerPreviewComponent from './layer-preview-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    dashboardDetail: state.LayerPreviewComponent
  }),
  actions
)(LayerPreviewComponent);

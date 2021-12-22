import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

// selectors
import { getLayers } from './selectors';

// component
import LayerPreviewComponent from './component';

// Mandatory
export { actions, reducers, initialState };

export default connect(
  (state) => ({
    adminLayerPreview: state.adminLayerPreview,
    interactions: state.interactions.added,
    layers: getLayers(state),
  }),
  actions,
)(LayerPreviewComponent);

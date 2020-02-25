import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

// selectors
import { getLayerGroup, getLayerIsActive } from './selectors';

// component
import DatasetLayerCardComponent from './component';

export default connect(
  (state, props) => ({
    layerGroup: getLayerGroup(state, props),
    layerIsActive: getLayerIsActive(state, props)
  }),
  actions
)(DatasetLayerCardComponent);

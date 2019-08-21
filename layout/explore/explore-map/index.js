import { connect } from 'react-redux';

// actions
import * as actions from 'layout/explore/actions';

// selectors
import {
  getMapProps,
  getUpdatedLayers,
  getUpdatedLayerGroups,
  getActiveInteractiveLayers
} from './selectors';

// components
import ExploreMap from './component';

export default connect(
  state => ({
    ...state.explore.sidebar,
    ...state.explore.map,
    activeLayers: getUpdatedLayers(state),
    activeInteractiveLayers: getActiveInteractiveLayers(state),
    layerGroups: getUpdatedLayerGroups(state),
    ...getMapProps(state)
  }),
  actions
)(ExploreMap);

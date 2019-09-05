import { connect } from 'react-redux';

// actions
import * as actions from 'layout/explore/actions';

// selectors
import {
  getMapProps,
  exploreMapGetUpdatedLayerGroups,
  exploreMapGetUpdatedLayers,
  exploreMapGetActiveInteractiveLayers
} from './selectors';

// components
import ExploreMap from './component';

export default connect(
  state => ({
    ...state.explore.sidebar,
    ...state.explore.map,
    activeLayers: exploreMapGetUpdatedLayers(state),
    activeInteractiveLayers: exploreMapGetActiveInteractiveLayers(state),
    layerGroups: exploreMapGetUpdatedLayerGroups(state),
    ...getMapProps(state)
  }),
  actions
)(ExploreMap);

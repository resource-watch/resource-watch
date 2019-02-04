import { connect } from 'react-redux';

// actions
import * as actions from 'layout/explore/explore-actions';

// selectors
import { getUpdatedLayers } from './explore-map-selectors';

// components
import ExploreMapComponent from './explore-map-component';

export default connect(
  state => ({
    // Store
    ...state.explore.sidebar,
    ...state.explore.map,
    activeLayers: getUpdatedLayers(state)
  }),
  actions
)(ExploreMapComponent);

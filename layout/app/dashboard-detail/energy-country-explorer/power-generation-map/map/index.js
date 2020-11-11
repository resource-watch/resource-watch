import { connect } from 'react-redux';

// actions
import * as actions from 'layout/explore/actions';

// selectors
import {
  getMapProps,
  exploreMapGetUpdatedLayerGroups,
  exploreMapGetUpdatedLayers,
  exploreMapGetActiveInteractiveLayers,
} from 'layout/explore/explore-map/selectors';

import ExploreMap from 'layout/explore/explore-map/component';

export default connect(
  (state, props) => {
    const { aoi } = props;

    return ({
      ...state.explore.sidebar,
      ...state.explore.map,
      token: state.user.token,
      activeInteractiveLayers: exploreMapGetActiveInteractiveLayers(state),
      layerGroups: exploreMapGetUpdatedLayerGroups(state),
      ...getMapProps(state),
      activeLayers: [
        ...exploreMapGetUpdatedLayers(state),
        ...aoi ? [aoi] : [],
      ],
    });
  },
  actions,
)(ExploreMap);

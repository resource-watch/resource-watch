import { connect } from 'react-redux';

// actions
import {
  toggleMapLayerGroup,
  setMapLayerGroupActive,
  resetMapLayerGroupsInteraction
} from 'layout/explore/actions';

import MapMenuComponent from './component';

export default connect(state => (
  { responsive: state.responsive }),
  {
    toggleMapLayerGroup,
    setMapLayerGroupActive,
    resetMapLayerGroupsInteraction
  }
)(MapMenuComponent);

// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreMapComponent from './explore-map-component';

export default connect(
  state => ({
    // Store
    ...state.explore.sidebar,
    ...state.explore.map
  }),
  actions
)(ExploreMapComponent);

// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreHeaderComponent from './explore-header-component';

export default connect(
  state => ({
    // Store
    ...state.explore.filters
  }),
  actions
)(ExploreHeaderComponent);

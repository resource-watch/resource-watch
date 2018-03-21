// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreDatasetsSortComponent from './explore-datasets-sort-component';

export default connect(
  state => ({
    // Store
    ...state.explore.sort
  }),
  actions
)(ExploreDatasetsSortComponent);

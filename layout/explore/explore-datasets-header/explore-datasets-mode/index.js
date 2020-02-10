// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreDatasetsModeComponent from './explore-datasets-mode-component';

export default connect(
  state => ({
    // Store
    ...state.explore.datasets
  }),
  actions
)(ExploreDatasetsModeComponent);

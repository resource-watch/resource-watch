// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreDatasetsHeaderComponent from './explore-datasets-header-component';

export default connect(
  state => ({
    // Store
    ...state.explore.datasets
  }),
  actions
)(ExploreDatasetsHeaderComponent);

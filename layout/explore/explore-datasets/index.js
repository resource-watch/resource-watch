// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreDatasetsComponent from './explore-datasets-component';

export default connect(
  state => ({
    // Store
    ...state.explore.datasets,
    ...state.explore.filters,
    responsive: state.responsive
  }),
  actions
)(ExploreDatasetsComponent);

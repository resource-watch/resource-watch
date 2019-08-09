// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreDatasetsHeaderComponent from './explore-datasets-header-component';

export default connect(
  state => ({
    ...state.explore.datasets,
    responsive: state.responsive
  }),
  actions
)(ExploreDatasetsHeaderComponent);

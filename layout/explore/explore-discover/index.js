// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreDiscoverComponent from './component';

export default connect(
  state => ({
    responsive: state.responsive,
    selectedDataset: state.explore.datasets.selected
  }),
  actions
)(ExploreDiscoverComponent);

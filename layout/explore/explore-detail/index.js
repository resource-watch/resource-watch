import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

// component
import ExploreDetailComponent from './component';

export default connect(
  state => ({
    // Store
    dataset: state.explore.datasets.selected
  }),
  actions
)(ExploreDetailComponent);

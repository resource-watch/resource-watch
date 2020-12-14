import { connect } from 'react-redux';

// actions
import * as actions from 'layout/explore/actions';

// component
import ExploreCollectionsComponent from './component';

export default connect(
  (state) => ({
    token: state.user.token,
    selectedDataset: state.explore.datasets.selected,
    selectedCollection: state.explore.sidebar.selectedCollection,
  }),
  actions,
)(ExploreCollectionsComponent);

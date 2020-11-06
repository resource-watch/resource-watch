import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

// component
import ExploreMenu from './component';

export default connect(
  (state) => ({
    ...state.explore.filters,
    shouldAutoUpdateSortDirection: state.explore.sort.isSetFromDefaultState,
    sortSelected: state.explore.sort.selected,
    section: state.explore.sidebar.section,
    selectedCollection: state.explore.sidebar.selectedCollection,
    userIsLoggedIn: !!state.user.id,
    selectedDataset: state.explore.datasets.selected,
    token: state.user.token,
  }),
  actions,
)(ExploreMenu);

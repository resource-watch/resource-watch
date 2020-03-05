// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreMenuComponent from './component';

export default connect(
  state => ({
    // Store
    ...state.explore.filters,
    shouldAutoUpdateSortDirection: state.explore.sort.isSetFromDefaultState,
    sortSelected: state.explore.sort.selected,
    section: state.explore.sidebar.section,
    selectedCollection: state.explore.sidebar.selectedCollection,
    collections: state.user.collections.items
  }),
  actions
)(ExploreMenuComponent);

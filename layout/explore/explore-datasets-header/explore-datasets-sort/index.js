// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreDatasetsSortComponent from './explore-datasets-sort-component';

export default connect(
  state => ({
    // Store
    ...state.explore.sort,
    canChangeSortDirection: state.explore.sort.selected !== 'relevance',
    options: state.explore.sort.options.filter(e => e.value !== 'relevance' || state.explore.filters.search.length > 0)
  }),
  actions
)(ExploreDatasetsSortComponent);

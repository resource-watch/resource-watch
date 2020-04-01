// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import { getFilteredFavorites } from './selectors';
import ExploreFavoritesComponent from './component';

export default connect(
  state => ({
    favorites: getFilteredFavorites(state),
    selectedDataset: state.explore.datasets.selected
  }),
  actions
)(ExploreFavoritesComponent);

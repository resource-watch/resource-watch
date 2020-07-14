import { createSelector } from 'reselect';

const getFavorites = state => state.user.favourites.items;

export const getFilteredFavorites = createSelector(
  [getFavorites],
  _favorites => _favorites.filter(f => f.resourceType === 'dataset')
);

export default { getFilteredFavorites };

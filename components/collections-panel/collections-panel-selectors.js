import { createSelector } from 'reselect';

const getUserCollection = state => state.user.collections.items;
const getUserFavourites = state => state.user.favourites.items;

export const parseCollections = createSelector(
  [getUserCollection],
  collections =>
    collections.map(collection => ({
      id: collection.id,
      ...collection.attributes
    }))
);

export const parseFavourites = createSelector(
  [getUserFavourites],
  favourites =>
    favourites.map(favourite => ({
      id: favourite.id,
      ...favourite.attributes
    }))
);

export default {
  parseCollections,
  parseFavourites
};

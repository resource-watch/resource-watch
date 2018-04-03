import { createSelector } from 'reselect';

const getUserFavourites = state => state.user.favourites.items;

export const parseFavourites = createSelector(
  [getUserFavourites],
  favourites =>
    favourites.map(favourite => ({
      id: favourite.id,
      ...favourite.attributes
    }))
);

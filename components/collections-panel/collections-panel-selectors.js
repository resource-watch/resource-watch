import { createSelector } from 'reselect';

const getUserCollection = state => state.user.collections.items;

export const parseCollections = createSelector(
  [getUserCollection],
  collections =>
    collections.map(collection => ({
      id: collection.id,
      ...collection.attributes
    }))
);


export default {
  parseCollections
};

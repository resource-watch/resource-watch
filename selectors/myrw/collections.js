import includes from 'lodash/includes';
import { createSelector } from 'reselect';

// Get the pulse
const collections = state => state.user.collections;

const getUserCollections = (collections) => {
  if (!collections.filter.length) {
    return collections.items;
  }
  return collections.items.filter(col =>
    includes(col.attributes.name.toLowerCase(), collections.filter.toLowerCase()));
};


export default createSelector(collections, getUserCollections);

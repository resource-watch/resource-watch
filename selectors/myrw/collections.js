import includes from 'lodash/includes';
import { createSelector } from 'reselect';

// Get the pulse
const collections = state => state.user.collections;

const getUserCollections = (cols) => {
  if (!cols.filter.length) {
    return cols.items;
  }
  return cols.items.filter(col =>
    includes(col.name.toLowerCase(), cols.filter.toLowerCase()));
};


export default createSelector(collections, getUserCollections);

import { createSelector } from 'reselect';

const getCollections = state => state.user.collections.items;

export const getCollectionsFiltered = createSelector(
  [getCollections],
  _collections =>
    // only return collections that have at least one dataset
    _collections.filter(col => col.resources.find(r => r.type === 'dataset'))

);

export default { getCollectionsFiltered };

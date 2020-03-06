import { createSelector } from 'reselect';

const getCollections = state => state.user.collections.items;
const getSelectedCollection = state => state.explore.sidebar.selectedCollection;

export const getCollection = createSelector(
  [getCollections, getSelectedCollection],
  (_collections, _selectedCollection) => _collections.find(c => c.id === _selectedCollection)
);

export default { getCollection };

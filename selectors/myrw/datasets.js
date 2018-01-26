import { createSelector } from 'reselect';

const datasets = state => state.datasets.datasets.list;
const userId = state => state.user.id;
const filters = state => state.datasets.datasets.filters;
const favourites = state => state.user.favourites.items;
const collections = state => state.user.collections.items;
const currentTab = state => state.routes.query.subtab;

const getUserDatasets = createSelector(datasets, userId,
  (_datasets, _userId) => _datasets.filter(dataset => dataset.userId === _userId));

const getFavouriteDatasets = createSelector(favourites, datasets,
  (_favs, _datasets) => {
    const favouritedResourcesIds = _favs
      .filter(fav => fav.attributes.resourceType === 'dataset')
      .map(fav => fav.attributes.resourceId);

    return _datasets.filter(dataset => favouritedResourcesIds.includes(dataset.id));
  });

const getDatasetsByCollection = createSelector(collections, datasets, currentTab,
  (_collections, _datasets, _collectionId) => {
    const matchedResources = (((_collections
      .find(collection => collection.id === _collectionId) || {}).attributes || {}).resources) || []
        .filter(resource => resource.type === 'dataset');

    const datasetsInTheCollection = matchedResources.map(collection => collection.id);

    return _datasets.filter(dataset => datasetsInTheCollection.includes(dataset.id));
  });

const performSearch = (datasetsAvailable, _filters) => {
  if (!_filters.length) return datasetsAvailable;

  return datasetsAvailable.filter(dataset =>
    _filters.every((filter) => {
      if (filter.key === 'id') return dataset.id === filter.value;
      if (!dataset[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return dataset[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return dataset[filter.key] === filter.value;
    }));
};

const getFilteredDatasets =
  (userDatasets, favouritedDatasets, collectionDatasets, _currentTab, _filters) => {
    if (_currentTab === 'my_datasets') return performSearch(userDatasets, _filters);
    if (_currentTab === 'favourites') return performSearch(favouritedDatasets, _filters);

    return performSearch(collectionDatasets, _filters);
  };

export default createSelector(
  getUserDatasets,
  getFavouriteDatasets,
  getDatasetsByCollection,
  currentTab,
  filters,
  getFilteredDatasets
);

import { createSelector } from 'reselect';

// Get the datasets
const datasetList = explore => explore.datasets.list;
const datasetPage = explore => explore.datasets.page;
const datasetLimit = explore => explore.datasets.limit;

// Create a function to compare the current active datatasets and the current pulseIds
const getpaginatedDatasets = (_list, _page, _limit) => {
  const from = (_page - 1) * _limit;
  const to = ((_page - 1) * _limit) + _limit;

  return _list.slice(from, to);
};

// Export the selector
export default createSelector(datasetList, datasetPage, datasetLimit, getpaginatedDatasets);

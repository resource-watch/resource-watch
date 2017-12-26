import { createSelector } from 'reselect';

import { selectElementsFromTree, deselectAllElementsFromTree } from 'utils/explore/TreeUtil';

const data = state => state.exploreDatasetFilters.data;
const filters = state => state.exploreDatasetFilters.filters;

const getFilterStatus = (_data, _filters) => {
  if (!Object.keys(_data).length) return {};
  if (!Object.keys(_filters).length) return _data;

  const data = _data;

  Object.keys(_filters).forEach((filterKey) => {
    const filterValues = _filters[filterKey];
    const dataTree = _data[filterKey] || [];
    dataTree.forEach(child => deselectAllElementsFromTree(child));
    dataTree.forEach(child => selectElementsFromTree(child, filterValues));
  });

  return data;
};

export default createSelector(data, filters, getFilterStatus);

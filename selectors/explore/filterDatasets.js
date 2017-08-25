import { createSelector } from 'reselect';

// Get datasets
const datasetList = state => state.explore.datasets.list;
const filters = state => state.explore.filters;

// Filter datasets by issues
const getFilteredDatasets = (_list, _filters, conceptFilteredList) => {
  const search = _filters.search;
  const conceptsSpecified = _filters.topics || _filters.geographies || _filters.dataType;

  return _list.filter((it) => {
    let searchFilterPassed = false;

    if (search && search.key === 'name') {
      if (it.attributes.name.toLowerCase().match(search.value.toLowerCase())) {
        searchFilterPassed = true;
      }
    }

    const searchCheck = (search && searchFilterPassed) || !search;
    const conceptsCheck = (conceptsSpecified) || !conceptsSpecified;

    return searchCheck && conceptsCheck;
  });
};

// Export the selector
export default createSelector(datasetList, filters, getFilteredDatasets);

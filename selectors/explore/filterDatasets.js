import { createSelector } from 'reselect';

// Get datasets
const datasetList = state => state.explore.datasets.list;
const filters = state => state.explore.filters;

// Filter datasets by issues
const getFilteredDatasets = (_list, _filters) => {
  const search = _filters.search;
  const datasetsFilteredByConcepts = _filters.datasetsFilteredByConcepts;

  return _list.filter((it) => {
    let searchFilterPassed = false;
    let conceptsCheckPassed = true;

    if (search && search.key === 'name') {
      if (it.attributes.name.toLowerCase().match(search.value.toLowerCase())) {
        searchFilterPassed = true;
      }
    }

    if (datasetsFilteredByConcepts) {
      conceptsCheckPassed = datasetsFilteredByConcepts.includes(it.id);
      if (conceptsCheckPassed) {
        debugger;
      }

    }

    const searchCheck = (search && searchFilterPassed) || !search;
    const conceptsCheck = (datasetsFilteredByConcepts && conceptsCheckPassed) ||
      !datasetsFilteredByConcepts;

    return searchCheck && conceptsCheck;
  });
};

// Export the selector
export default createSelector(datasetList, filters, getFilteredDatasets);

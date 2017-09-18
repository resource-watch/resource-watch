import { createSelector } from 'reselect';

// Get datasets
const datasetList = state => state.explore.datasets.list;
const filters = state => state.explore.filters;
const datasetPage = state => state.explore.datasets.page;
const datasetLimit = state => state.explore.datasets.limit;

const getPaginatedDatasets = (_list, _page, _limit) => {
  const from = (_page - 1) * _limit;
  const to = ((_page - 1) * _limit) + _limit;

  return _list.slice(from, to);
};

// Filter datasets by issues
const getFilteredDatasets = (_list, _filters, _page, _limit) => {
  const search = _filters.search;
  const datasetsFilteredByConcepts = _filters.datasetsFilteredByConcepts;
  const AreFiltersApplied = datasetsFilteredByConcepts.length || !!search;

  if (!AreFiltersApplied) {
    return {
      totalFilteredDatasets: _list || [],
      filteredDatasets: getPaginatedDatasets(_list, _page, _limit)
    };
  }

  const filteredDatasets = _list.filter((it) => {
    let searchFilterPassed = false;
    let conceptsCheckPassed = true;

    if (search && search.key === 'name') {
      if (it.attributes.metadata[0] && it.attributes.metadata[0].attributes.info) {
        if (it.attributes.metadata[0].attributes.info.name) {
          if (it.attributes.metadata[0].attributes.info.name.toLowerCase().match(search.value.toLowerCase())) {
            searchFilterPassed = true;
          }
        }
      } else if (it.attributes.name.toLowerCase().match(search.value.toLowerCase())) {
        searchFilterPassed = true;
      }
    }

    if (datasetsFilteredByConcepts) {
      conceptsCheckPassed = datasetsFilteredByConcepts.includes(it.id);
    }

    const searchCheck = (search && searchFilterPassed) || !search;
    const conceptsCheck = (datasetsFilteredByConcepts.length &&
      datasetsFilteredByConcepts.length > 0
      && conceptsCheckPassed) ||
      !datasetsFilteredByConcepts.length || !datasetsFilteredByConcepts.length > 0;

    return searchCheck && conceptsCheck;
  });

  return {
    totalFilteredDatasets: filteredDatasets || [],
    filteredDatasets: getPaginatedDatasets(filteredDatasets, _page, _limit)
  };
};

// Export the selector
export default createSelector(datasetList, filters, datasetPage, datasetLimit, getFilteredDatasets);

import { createSelector } from 'reselect';

// Get datasets
const datasetList = state => state.explore.datasets.list;
const filters = state => state.explore.filters;
const datasetPage = state => state.explore.datasets.page;
const datasetLimit = state => state.explore.datasets.limit;
const datasetSorting = state => state.explore.sorting;

const getPaginatedDatasets = (_list, _page, _limit) => {
  const from = (_page - 1) * _limit;
  const to = ((_page - 1) * _limit) + _limit;

  return _list.slice(from, to);
};

/**
 * Return a sorted list of datasets
 * @param {{ id: string, type: string, attributes: any }[]} datasets Datasets
 * @param {{ order: string, datasets: string[], loading: boolean }[]} sorting Sorting object
 */
const getSortedDatasets = (datasets, sorting) => {
  if (sorting.order === 'modified' || sorting.loading) {
    return datasets;
  }

  return datasets.sort((a, b) => {
    const aPos = sorting.datasets.indexOf(a.id);
    const bPos = sorting.datasets.indexOf(b.id);

    if (aPos === -1 && bPos === -1) return 0;
    if (aPos === -1 && bPos !== -1) return 1;
    if (aPos !== -1 && bPos === -1) return -1;
    return aPos - bPos;
  });
};

// Filter datasets by issues
const getFilteredDatasets = (_list, _filters, _page, _limit, _sorting) => {
  const { search, topics, dataType, geographies, datasetsFilteredByConcepts } = _filters;
  const haveResults = datasetsFilteredByConcepts.length;
  const areFiltersApplied = ([...topics || [], ...geographies || [], ...dataType || []].length) || search;

  if (!haveResults && areFiltersApplied && !search) {
    return {
      totalFilteredDatasets: [],
      filteredDatasets: getPaginatedDatasets([], _page, _limit)
    };
  }

  if (!areFiltersApplied) {
    return {
      totalFilteredDatasets: _list || [],
      filteredDatasets: getPaginatedDatasets(getSortedDatasets(_list, _sorting), _page, _limit)
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

  const sortedFilteredDatasets = getSortedDatasets(filteredDatasets, _sorting);

  return {
    totalFilteredDatasets: sortedFilteredDatasets || [],
    filteredDatasets: getPaginatedDatasets(sortedFilteredDatasets, _page, _limit)
  };
};

// Export the selector
export default createSelector(
  datasetList,
  filters,
  datasetPage,
  datasetLimit,
  datasetSorting,
  getFilteredDatasets
);

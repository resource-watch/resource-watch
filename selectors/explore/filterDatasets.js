import { createSelector } from 'reselect';

// Get datasets
const datasetList = (state) => state.explore.datasets.list;
const filters = (state) => state.explore.filters;
const exploreDatasetFilters = (state) => state.exploreDatasetFilters.filters;
const datasetPage = (state) => state.explore.datasets.page;
const datasetLimit = (state) => state.explore.datasets.limit;
const datasetSorting = (state) => state.explore.sorting;

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

  return [...datasets].sort((a, b) => {
    const aPos = sorting.datasets.indexOf(a.id);
    const bPos = sorting.datasets.indexOf(b.id);

    if (aPos === -1 && bPos === -1) return 0;
    if (aPos === -1 && bPos !== -1) return 1;
    if (aPos !== -1 && bPos === -1) return -1;
    return aPos - bPos;
  });
};

// Filter datasets by issues
const getFilteredDatasets = (_list, _filters, _exploreDatasetFilters, _page, _limit, _sorting) => {
  const { search, datasetsFilteredByConcepts } = _filters;
  const { topics, dataTypes, geographies } = _exploreDatasetFilters;
  const haveResults = datasetsFilteredByConcepts.length;
  const areFiltersApplied = ([...topics || [], ...geographies || [],
    ...dataTypes || []].length) || search;

  if (!haveResults && areFiltersApplied && !search) {
    return {
      totalFilteredDatasets: [],
      filteredDatasets: getPaginatedDatasets([], _page, _limit),
    };
  }

  if (!areFiltersApplied) {
    return {
      totalFilteredDatasets: _list || [],
      filteredDatasets: getPaginatedDatasets(getSortedDatasets(_list, _sorting), _page, _limit),
    };
  }

  const filteredDatasets = _list.filter((it) => {
    let searchFilterPassed = false;
    let conceptsCheckPassed = true;

    if (search && search.key === 'name') {
      const searchSt = search.value.toLowerCase();

      if (it.attributes.metadata.length > 0) {
        const metadataObj = it.attributes.metadata[0].attributes;
        const infoObj = metadataObj.info;

        const nameCheck = infoObj.name && infoObj.name.toLowerCase().indexOf(searchSt) >= 0;
        const functionsCheck = infoObj.functions && infoObj.functions.toLowerCase().indexOf(searchSt) >= 0;
        const sourceCheck = metadataObj.source && metadataObj.source.toLowerCase().indexOf(searchSt) >= 0;

        if (nameCheck || functionsCheck || sourceCheck) {
          searchFilterPassed = true;
        }
      } else if (it.attributes.name.toLowerCase().indexOf(searchSt) >= 0) {
        searchFilterPassed = true;
      }
      if (it.attributes.vocabulary.length > 0) {
        const vocabulary = it.attributes.vocabulary[0];
        const tagsCheck = vocabulary.attributes.tags.find((tag) => tag.toLowerCase().indexOf(searchSt) >= 0);
        if (tagsCheck) {
          searchFilterPassed = true;
        }
      }
    }

    if (datasetsFilteredByConcepts) {
      conceptsCheckPassed = datasetsFilteredByConcepts.includes(it.id);
    }

    const searchCheck = (search && searchFilterPassed) || !search;
    const conceptsCheck = (datasetsFilteredByConcepts.length
      && datasetsFilteredByConcepts.length > 0
      && conceptsCheckPassed)
      || !datasetsFilteredByConcepts.length || !datasetsFilteredByConcepts.length > 0;

    return searchCheck && conceptsCheck;
  });

  const sortedFilteredDatasets = getSortedDatasets(filteredDatasets, _sorting);

  return {
    totalFilteredDatasets: sortedFilteredDatasets || [],
    filteredDatasets: getPaginatedDatasets(sortedFilteredDatasets, _page, _limit),
  };
};

// Export the selector
export default createSelector(
  datasetList,
  filters,
  exploreDatasetFilters,
  datasetPage,
  datasetLimit,
  datasetSorting,
  getFilteredDatasets,
);

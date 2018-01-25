import { createSelector } from 'reselect';

const datasets = state => state.datasets.datasets.list;
const filters = state => state.datasets.datasets.filters;

/**
 * Return the datasets that comply with the filters
 * @param {object[]} datasets Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the datasets
 */
const getFilteredDatasets = (datasets, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) return datasets;

  return datasets.filter(dataset =>
    filters.every((filter) => {
      if (filter.key === 'id') return dataset.id === filter.value;
      if (!dataset[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return dataset[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return dataset[filter.key] === filter.value;
    }));
};


export default createSelector(datasets, filters, getFilteredDatasets);

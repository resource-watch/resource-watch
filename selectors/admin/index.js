import { createSelector } from 'reselect';

const layerSelector = state => state.layers.layers.list;
const layerFilterSelector = state => state.layers.layers.filters;

const datasetSelector = state => state.datasets.datasets.list;
const datasetFilterSelector = state => state.datasets.datasets.filters;

/**
 * Return the datasets that comply with the filters
 * @param {object[]} datasets Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the datasets
 */
const getFilteredContent = (data, filters) => {
  if (!filters.length) return data;

  return data.filter(dataset =>
    filters.every((filter) => {
      if (filter.key === 'id') return dataset.id === filter.value;
      if (!dataset.attributes[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return dataset.attributes[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return dataset.attributes[filter.key] === filter.value;
    })
  );
};

export default {
  getFilteredLayers: createSelector(layerSelector, layerFilterSelector, getFilteredContent),
  getFilteredDatasets: createSelector(datasetSelector, datasetFilterSelector, getFilteredContent)
};

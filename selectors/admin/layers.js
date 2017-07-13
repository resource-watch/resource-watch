import { createSelector } from 'reselect';

const layers = state => state.layers.layers.list;
const filters = state => state.layers.layers.filters;

/**
 * Return the layers that comply with the filters
 * @param {object[]} layers Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the layers
 */
const getFilteredLayers = (layers, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) return layers;

  return layers.filter((layer) => { // eslint-disable-line arrow-body-style
    return filters.every((filter) => {
      if (filter.key === 'id') return layer.id === filter.value;
      if (!layer.attributes[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return layer.attributes[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return layer.attributes[filter.key] === filter.value;
    });
  });
};

export default createSelector(layers, filters, getFilteredLayers);

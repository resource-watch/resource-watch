import { createSelector } from 'reselect';

/**
 * Return the list of layer groups with their associated data
 * The only difference with the type LayerGroup[] is that each
 * layer gets as attributes its associated data from the API and
 * an order attribute (think z-index)
 * @param {object[]} datasets - List of datasets coming from the API
 * @param {LayerGroup[]} layerGroups - List of layer groups (defined in explore.js)
 */
const getLayerGroups = (datasets, layerGroups) => {
  if (!datasets.length) return [];

  return layerGroups.map((layerGroup, index) => {
    const dataset = datasets.find(d => d.id === layerGroup.dataset);
    const layers = [...layerGroup.layers].map(layer => ({
      ...layer,
      ...dataset.attributes.layer.find(l => l.id === layer.id).attributes,
      order: layerGroups.length - index // Like z-index: higher = on top
    }));
    return Object.assign({}, layerGroup, { layers });
  });
};

const datasets = ({ explore }) => explore.datasets.list;
const layerGroups = ({ explore }) => explore.layers;

export default createSelector(datasets, layerGroups, getLayerGroups);

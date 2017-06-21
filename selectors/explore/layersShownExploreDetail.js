import { createSelector } from 'reselect';

// Get the layers and filters from state

const layers = state => state.exploreDetail.dataset.detail.attributes.layer;
const layersShownIds = state => state.exploreDetail.dataset.layersShownIds;

// Create a function to compare the current layers and the current layersShownIds
const updateLayersShown = (_layers, _layersShownIds) => {
  const layerList = [];

  if (_layers.length) {
    _layersShownIds.forEach((id) => {
      const matchedLayer = _layers.filter(d => d.id === id)[0].attributes;
      layerList.push(matchedLayer);
    });
  }

  return layerList;
};

// Export the selector
export default createSelector(
  layers,
  layersShownIds,
  updateLayersShown
);

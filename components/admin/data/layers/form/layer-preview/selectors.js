import { createSelector } from 'reselect';

// states
const getLayerGroups = state => state.adminLayerPreview.layerGroups;

export const getLayers = createSelector(
  [getLayerGroups],
  (_layerGroups) => {
    if (!_layerGroups.length) return [];

    return _layerGroups.map(_layerGroup =>
      _layerGroup.layers.filter(_layer => _layer.active)).flat();
  }
);

export default { getLayers };

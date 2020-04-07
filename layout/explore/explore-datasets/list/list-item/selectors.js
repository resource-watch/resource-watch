import { createSelector } from 'reselect';

const getLayerGroups = state => state.explore.map.layerGroups;
const getDataset = (state, props) => props.dataset.id;

export const isActive = createSelector(
  [getLayerGroups, getDataset],
  (_layerGroups, _dataset) => !!_layerGroups.find(l => l.dataset === _dataset)
);

export default { isActive };

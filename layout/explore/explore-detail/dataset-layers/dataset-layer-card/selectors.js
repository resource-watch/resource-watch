import { createSelector } from 'reselect';


export const getLayerGroup = (state, props) =>
  state.explore.map.layerGroups.find(lg => lg.dataset === props.dataset.id);
const getLayerID = (state, props) => props.layer.id;

export const getLayerIsActive = createSelector(
  [getLayerGroup, getLayerID],
  (_layerGroup, _layerID) => {
    const layer = _layerGroup && _layerGroup.layers &&
      _layerGroup.layers.find(l => l.id === _layerID);
    return layer && layer.active;
  }
);


export default {
  getLayerGroup,
  getLayerIsActive
};

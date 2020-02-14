import { createSelector } from 'reselect';

const getContextLayers = state => state.contextLayersPulse.contextLayers;
const getActiveLayers = state => state.contextLayersPulse.activeLayers;

export const activeContextLayers = createSelector(
  [getContextLayers, getActiveLayers],
  (contextLayers, activeLayers) => contextLayers.filter(l => activeLayers.includes(l.id))
);


export default { activeContextLayers };

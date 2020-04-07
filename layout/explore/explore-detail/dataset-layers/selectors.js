import { createSelector } from 'reselect';


const getLayerGroup = (state, props) =>
  state.explore.map.layerGroups.find(lg => lg.dataset === props.dataset.id);
const getLayers = (state, props) => props.layers;

export const isATimelineDataset = createSelector(
    [getLayerGroup],
    (_layerGroup) => {
        return !!_layerGroup && _layerGroup.layers.find(l => l.layerConfig.timeline);
    }
);

export const getTimelineLayerMapbox = (state, props) =>
    props.layers.find(l => !!l.layerConfig.timeline_config);

export const getTimelineLayer = createSelector(
    [getLayerGroup, isATimelineDataset, getLayers],
    (_layerGroup, _isATimeline, _layers) => {
        if (_isATimeline) {
            const activeLayerValue = _layerGroup && _layerGroup.layers.find(l => l.active);
            // We need to use the layer from the "layers" property, instead of the layer object
            // found in the Redux state
            const activeLayer = activeLayerValue && _layers.find(l => l.id === activeLayerValue.id);
            
            if (activeLayer) {
                return activeLayer;
            } else if (_layers.length && _layers.length > 0){
                return _layers[0];
            }
        } else {
            return null;
        }
    }
);

export default {
    isATimelineDataset,
    getTimelineLayerMapbox,
    getTimelineLayer
};

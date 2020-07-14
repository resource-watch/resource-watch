import { createAction, createThunkAction } from 'redux-tools';

// Components
import LayerGlobeManager from 'utils/layers/LayerGlobeManager';

// Services
import { fetchLayer } from 'services/layer';

export const setContextLayers = createAction('layer-pill/setContextLayers');
export const setContextActiveLayers = createAction('layer-pill/setContextActiveLayers');
export const setContextLayersLoading = createAction('layer-pill/setContextLayersLoading');
export const setContextLayersError = createAction('layer-pill/setContextLayersError');


export const toggleContextualLayer = createThunkAction('layer-pill/toggleContextualLayer', id =>
  async (dispatch, getState) => {
    const { contextLayersPulse } = getState();
    const { contextLayers, activeLayers } = contextLayersPulse;

    const newContextLayers = contextLayers.slice(0);
    const newActiveLayers = activeLayers.slice(0);

    const layerFound = contextLayers.find(l => l.id === id);

    if (!layerFound) {
      dispatch(setContextLayersLoading(true));
      await fetchLayer(id)
        .then((response) => {
          const manager = new LayerGlobeManager();
          manager.addLayer(
            response,
            {
              onLayerAddedSuccess: function success(result) {
                newContextLayers.push(result);
                dispatch(setContextLayers(newContextLayers));
              }
            },
            true
          );
          dispatch(setContextLayersLoading(false));
        })
        .catch(error => dispatch(setContextLayersError(error.message)));
    }

    const index = newActiveLayers.indexOf(id);
    if (index < 0) {
      newActiveLayers.push(id);
    } else {
      newActiveLayers.splice(index, 1);
    }

    dispatch(setContextActiveLayers(newActiveLayers));
  });

import { createAction, createThunkAction } from 'redux-tools';

// Services
import LayersService from 'services/LayersService';

export const setContextLayers = createAction('layer-pill/setContextLayers');
export const setActiveLayers = createAction('layer-pill/setActiveLayers');
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
      const layersService = new LayersService();
      await layersService.fetchData({ id })
        .then(response => newContextLayers.push(response))
        .catch(error => dispatch(setContextLayersError(error)));
      dispatch(setContextLayers(newContextLayers));
    }

    const index = newActiveLayers.indexOf(id);
    if (index < 0) {
      newActiveLayers.push(id);
    } else {
      newActiveLayers.splice(index, 1);
    }

    dispatch(setActiveLayers(newActiveLayers));
  });

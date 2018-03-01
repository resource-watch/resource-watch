import { createThunkAction } from 'redux-tools';

// Services
import LayersService from 'services/LayersService';

export const toggleContextualLayer = createThunkAction('layer-pill/toggleContextualLayer', id =>
  async (dispatch, getState) => {
    const { contextLayersPulse } = getState();
    const { contextLayers } = contextLayersPulse;
    const layerFound = contextLayers.find(l => l.id === id);
    if (!layerFound) {
      const layersService = new LayersService();
      await layersService.fetchData({ id }).then(response => contextLayers.push(response));
    }
    const result = { contextLayers, id };
    console.log('result', result);
    return result;
  });

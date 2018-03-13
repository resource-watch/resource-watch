import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// Utils
import { LAYERS_PLANET_PULSE } from 'utils/layers/pulse_layers';

export const setLayers = createAction('PULSE/setLayers');
export const setLayersLoading = createAction('PULSE/setLayersLoading');
export const setLayersError = createAction('PULSE/setLayersError');
export const setActiveLayer = createAction('PULSE/setActiveLayer');
export const setLayerPoints = createAction('PULSE/setLayerPoints');
export const setLayerPointsLoading = createAction('PULSE/setLayerPointsLoading');
export const setLayerPointsError = createAction('PULSE/setLayerPointsError');
export const setSimilarWidgets = createAction('PULSE/setSimilarWidgets');
export const resetLayerPoints = createAction('PULSE/resetLayerPoints');

export const getLayers = createThunkAction('PULSE/getLayers', () =>
  (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch(setLayersLoading(true));

    const layers = LAYERS_PLANET_PULSE;
    dispatch(setLayers(layers));
  });

export const getLayerPoints = createThunkAction('PULSE/getLayerPoints', queryUrl =>
  (dispatch) => {
    dispatch(setLayerPointsLoading(true));
    fetch(new Request(queryUrl))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        dispatch(setLayerPoints(response.data));
      })
      .catch((err) => {
      // Fetch from server ko -> Dispatch error
        dispatch(setLayerPointsError(err));
      });
  });

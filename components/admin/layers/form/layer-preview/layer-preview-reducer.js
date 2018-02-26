import * as actions from './layer-preview-actions';

export const initialState = {
  interaction: null,
  interactionLatLng: null,
  layerGroups: {}
};

export default {
  [actions.setLayerGroups]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.setLayerInteraction]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.setLayerInteractionLatLng]: (state, { payload }) => ({ ...state, ...payload })
};

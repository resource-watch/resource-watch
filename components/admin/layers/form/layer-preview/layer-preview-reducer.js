import * as actions from './layer-preview-actions';

export const initialState = {
  interaction: {},
  interactionLatLng: null,
  interactionSelected: null,
  layerGroups: []
};

export default {
  [actions.setLayerGroups]: (state, { payload }) => ({ ...state, ...payload, interaction: {} }),
  [actions.setLayerInteractionLatLng]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.setLayerInteraction]: (state, { payload }) => {
    const interaction = {
      ...state.interaction,
      [payload.interaction.id]: payload.interaction
    };
    return Object.assign({}, state, { interaction });
  }
};

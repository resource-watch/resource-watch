import * as actions from './layer-preview-actions';

export default {
  [actions.setLayerGroups]: (state, { payload }) => ({ ...state, ...payload, interaction: {} }),
  [actions.setLayerInteractionLatLng]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.setLayerInteractionError]: (state, { payload }) => ({ ...state, errors: payload }),
  [actions.setLayerInteraction]: (state, { payload }) => {
    const interaction = {
      ...state.interaction,
      [payload.interaction.id]: payload.interaction
    };
    return Object.assign({}, state, { interaction });
  }
};

import * as actions from './layer-preview-actions';

export default {
  [actions.setLayerGroups]: (state, { payload }) => ({ ...state, ...payload, interaction: {} }),
  [actions.setLayerInteractionLatLng]: (state, { payload }) => ({ ...state, interactionLatLng: payload }),
  [actions.setLayerInteractionSelected]: (state, { payload }) => ({ ...state, interactionSelected: payload }),
  [actions.setLayerInteractionError]: (state, { payload }) => ({ ...state, errors: payload }),
  [actions.setLayerInteraction]: (state, { payload }) => {
    const interaction = {
      ...state.interaction,
      [payload.id]: payload
    };
    return Object.assign({}, state, { interaction });
  }
};

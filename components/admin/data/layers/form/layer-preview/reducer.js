import * as actions from './actions';

export default {
  [actions.setLayerGroups]: (state, { payload }) =>
    ({ ...state, ...payload, interaction: {} }),
  [actions.setLayerInteractionLatLng]: (state, { payload }) =>
    ({ ...state, interactionLatLng: payload }),
  [actions.setLayerInteractionSelected]: (state, { payload }) =>
    ({ ...state, interactionSelected: payload }),
  [actions.setLayerInteractionError]: (state, { payload }) =>
    ({ ...state, errors: payload }),
  [actions.setLayerInteraction]: (state, { payload }) => ({
    ...state,
    interaction: {
      ...state.interaction,
      ...payload
    }
  })
};

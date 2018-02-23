import * as actions from './actions';

export default {
  [actions.toggleContextualLayer]: (state, { payload }) => {
    const { activeLayers } = state;
    const index = activeLayers.indexOf(payload.id);
    if (index < 0) {
      activeLayers.push(payload.id);
    } else {
      activeLayers.splice(index, 1);
    }
    return { ...state, activeLayers, contextLayers: payload.contextLayers };
  }
};

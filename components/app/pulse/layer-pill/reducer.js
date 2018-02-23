import * as actions from './actions';

export default {
  [actions.toggleContextualLayer]: (state, { payload }) => {
    const { contextLayers } = state;
    const index = contextLayers.indexOf(payload);
    if (index < 0) {
      contextLayers.push(payload);
    } else {
      contextLayers.splice(index, 1);
    }
    return { ...state, contextLayers };
  }
};

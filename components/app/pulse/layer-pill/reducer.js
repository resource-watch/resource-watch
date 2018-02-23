import * as actions from './actions';

export default {
  [actions.toggleContextualLayer]: (state, { payload }) => {
    const { activeLayers, contextLayers } = state;
    const newActiveLayers = [...activeLayers];
    const newContextLayers = [...payload.contextLayers, ...contextLayers];

    const index = newActiveLayers.indexOf(payload);
    if (index < 0) {
      newActiveLayers.push(payload.id);
    } else {
      newActiveLayers.splice(index, 1);
    }

    return {
      ...state,
      activeLayers: newActiveLayers,
      contextLayers: newContextLayers
    };
  }
};

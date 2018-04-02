import * as actions from './actions';

export default {
  [actions.setLayers]: (state, action) =>
    ({ ...state, layers: action.payload }),

  [actions.setLayerGroups]: (state, action) =>
    ({ ...state, layerGroups: action.payload }),

  [actions.setLayerGroupsLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setLayerGroupsError]: (state, action) =>
    ({ ...state, error: action.payload })
};

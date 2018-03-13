import * as actions from './actions';

export default {
  [actions.setLayers]: (state, action) =>
    ({
      ...state,
      layers: action.payload,
      loading: false,
      error: null
    }),

  [actions.setLayersLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setLayersError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.setActiveLayer]: (state, action) =>
    ({ ...state, layerActive: (state.layerActive !== action.payload) ? action.payload : null }),

  [actions.setLayerPoints]: (state, action) =>
    ({
      ...state,
      layerPoints: action.payload,
      loading: false,
      error: null
    }),

  [actions.setLayerPointsLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setLayerPointsError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.setSimilarWidgets]: (state, action) =>
    ({ ...state, similarWidgets: action.payload }),

  [actions.resetLayerPoints]: state =>
    ({ ...state, layerPoints: [] })

};

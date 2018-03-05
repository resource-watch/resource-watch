import * as actions from './actions';

export default {
  [actions.resetLayerPoints]: state =>
    ({ ...state, layerPoints: null }),
  [actions.setActiveLayer]: (state, { payload }) =>
    ({ ...state, layerActive: (state.layerActive !== payload) ? payload : null }),
  [actions.setActiveLayerLoading]: (state, { payload }) =>
    ({ ...state, loading: payload }),
  [actions.setActiveLayerError]: (state, { payload }) =>
    ({ ...state, error: payload, layerActive: null })
};

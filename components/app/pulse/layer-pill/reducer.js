import * as actions from './actions';

export default {
  [actions.setContextLayers]: (state, { payload }) => ({ ...state, contextLayers: payload }),
  [actions.setActiveLayers]: (state, { payload }) => ({
    ...state,
    activeLayers: payload,
    activeLayersLoading: false
  }),
  [actions.setContextLayersLoading]: (state, { payload }) =>
    ({ ...state, contextLayersLoading: payload }),
  [actions.setContextLayersError]: (state, { payload }) => ({ ...state, error: payload })
};

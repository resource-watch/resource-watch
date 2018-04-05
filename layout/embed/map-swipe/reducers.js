import * as actions from './actions';

export default {
  [actions.setZoom]: (state, action) =>
    ({ ...state, zoom: action.payload }),

  [actions.setLatLng]: (state, action) =>
    ({ ...state, latLng: action.payload }),

  [actions.setLayerGroups]: (state, action) =>
    ({ ...state, layerGroups: action.payload }),

  [actions.setLayerGroupsLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setLayerGroupsError]: (state, action) =>
    ({ ...state, error: action.payload })
};

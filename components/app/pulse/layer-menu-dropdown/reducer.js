import * as actions from './actions';

export default {
  [actions.resetLayerPoints]: state =>
    ({ ...state, layerPoints: null }),
  [actions.setActiveLayer]: (state, { payload }) => {
    console.log('state', state, 'payload', payload);
    return ({ ...state, layerActive: (state.layerActive !== payload) ? payload : null });
  }

};

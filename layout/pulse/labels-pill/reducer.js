import * as actions from './actions';

export default {
  [actions.toggleLabelsLayer]: (state, { payload }) => ({
    url: payload,
    labelsLayerActive: !state.labelsLayerActive
  }),
  [actions.resetLabelsLayer]: () => ({ url: null, labelsLayerActive: false })
};

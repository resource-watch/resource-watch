import * as actions from './actions';

export default {
  [actions.toggleLabelsLayer]: (state, { payload }) => ({
    url: payload.url,
    labelsLayerActive: !state.labelsLayerActive
  })
};

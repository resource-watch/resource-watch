import * as actions from './actions';

export default {
  [actions.setDatasetData]: (state, { payload }) =>
    ({ ...state, dataset: payload }),
  [actions.setWidget]: (state, { payload }) =>
    ({ ...state, widget: payload })
};

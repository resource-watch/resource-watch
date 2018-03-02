import * as actions from './data-actions';

export default {
  [actions.setDataset]: (state, action) =>
    ({ ...state, data: action.payload })
};

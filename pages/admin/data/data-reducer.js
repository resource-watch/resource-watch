import * as actions from './data-actions';

export default {
  [actions.setActiveTab]: (state, action) =>
    ({ ...state, tab: action.payload })
};

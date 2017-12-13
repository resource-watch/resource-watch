import * as actions from './search-actions';

export default {
  [actions.setOpened]: (state, action) =>
    ({ ...state, opened: action.payload })
};

import * as actions from './actions';

export default {
  [actions.setDisplayed]: (state, { payload }) =>
    ({ ...state, displayed: payload })
};

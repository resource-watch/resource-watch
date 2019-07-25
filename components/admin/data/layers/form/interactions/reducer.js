import * as actions from './actions';

export const initialState = {
  added: [],
  available: [],
  loading: false
};

export default {
  [actions.setInteractions]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.toggleLoading]: state => ({ ...state, loading: !state.loading })
};

import * as actions from './interactions-actions';

export const initialState = {
  added: [],
  available: [],
  loading: false
};

export default {
  [actions.setInteractions]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.modifyInteractions]: state => ({ ...state }),
  [actions.toggleLoading]: state => ({ ...state, loading: !state.loading })
};

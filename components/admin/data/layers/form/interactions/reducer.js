import * as actions from './actions';
import initialState from './initial-state';

export default {
  [actions.setCurrentInteractions]: (state, { payload }) => ({ ...state, added: payload }),
  [actions.setAvailabletInteractions]: (state, { payload }) => ({ ...state, available: payload }),
  [actions.setLoading]: (state, { payload }) => ({ ...state, loading: payload }),
  [actions.resetInteractions]: () => ({ ...initialState })
};

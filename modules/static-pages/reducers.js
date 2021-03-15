import * as actions from './actions';

export default {
  [actions.setContentPage]: (state, { payload }) => ({
    ...state,
    [payload.key]: {
      ...state[payload.key],
      ...payload.value,
    },
  }),

  [actions.setLoading]: (state, { payload }) => ({
    ...state,
    loading: payload,
  }),
  [actions.setError]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
};

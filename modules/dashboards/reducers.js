import * as actions from './actions';

export default {
  [actions.setDashboards]: (state, { payload }) => ({
    ...state,
    [payload.key]: {
      ...state[payload.key],
      list: payload.value,
    },
  }),
  [actions.setDashboard]: (state, { payload }) => ({
    ...state,
    [payload.key]: {
      ...state[payload.key],
      data: payload.value,
    },
  }),

  [actions.setLoading]: (state, { payload }) => ({
    ...state,
    [payload.key]: {
      ...state[payload.key],
      loading: payload.value,
    },
  }),
  [actions.setError]: (state, { payload }) => ({
    ...state,
    [payload.key]: {
      ...state[payload.key],
      error: payload.value,
    },
  }),
};

import * as actions from './actions';

export default {
  [actions.setPartners]: (state, { payload }) => ({
    ...state,
    [payload.key]: {
      ...state[payload.key],
      list: payload.value,
    },
  }),
  [actions.setPartner]: (state, { payload }) => ({
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
  [actions.setFilters]: (state, { payload }) => ({
    ...state,
    filters: payload,
  }),
};

import * as actions from './actions';

export default {
  [actions.setTopics]: (state, { payload }) =>
    ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        data: payload.value
      }
    }),

  [actions.setLoading]: (state, { payload }) =>
    ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        loading: payload.value
      }
    }),
  [actions.setError]: (state, { payload }) =>
    ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        error: payload.value
      }
    }),
  [actions.setFilter]: (state, { payload }) =>
    ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        filters: payload.value
      }
    }),
  [actions.setSelected]: (state, { payload }) =>
    ({
      ...state,
      thumbnails: {
        ...state.thumbnails,
        selected: payload
      }
    })
};

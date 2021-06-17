import { createReducer } from '@reduxjs/toolkit';
import {
  HYDRATE,
} from 'next-redux-wrapper';

import * as actions from './actions';
import initialState from './initial-state';

export default createReducer(initialState, (builder) => {
  builder
    .addCase(HYDRATE, (state, { payload }) => ({ ...payload.dashboards }))
    .addCase(actions.setDashboards, (state, { payload }) => ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        list: payload.value,
      },
    }))
    .addCase(actions.setDashboard, (state, { payload }) => ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        data: payload.value,
      },
    }))
    .addCase(actions.setLoading, (state, { payload }) => ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        loading: payload.value,
      },
    }))
    .addCase(actions.setError, (state, { payload }) => ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        error: payload.value,
      },
    }));
});

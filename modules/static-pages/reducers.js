import { createReducer } from '@reduxjs/toolkit';
import {
  HYDRATE,
} from 'next-redux-wrapper';

import * as actions from './actions';
import initialState from './initial-state';

export default createReducer(initialState, (builder) => {
  builder
    .addCase(HYDRATE, (state, { payload }) => ({ ...payload.staticPages }))
    .addCase(actions.setContentPage, (state, { payload }) => ({
      ...state,
      [payload.key]: {
        ...state[payload.key],
        ...payload.value,
      },
    }))
    .addCase(actions.setLoading, (state, { payload }) => ({
      ...state,
      loading: payload,
    }))
    .addCase(actions.setError, (state, { payload }) => ({
      ...state,
      error: payload,
    }));
});

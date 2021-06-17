import { createReducer } from '@reduxjs/toolkit';
import {
  HYDRATE,
} from 'next-redux-wrapper';

import * as actions from './get-involved-actions';
import initialState from './get-involved-default-state';

export default createReducer(initialState, (builder) => {
  builder
    .addCase(HYDRATE, (state, { payload }) => ({ ...payload.getInvolvedIndex }))
    .addCase(actions.setStaticData, (state, { payload }) => ({
      ...state,
      staticData: payload,
    }))
    .addCase(actions.setStaticDataLoading, (state, { payload }) => ({
      ...state,
      loading: payload,
    }))
    .addCase(actions.setStaticDataError, (state, { payload }) => ({
      ...state,
      error: payload,
    }));
});

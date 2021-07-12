import { createReducer } from '@reduxjs/toolkit';
import {
  HYDRATE,
} from 'next-redux-wrapper';

import initialState from './search-default-state';

// actions
import * as actions from './search-actions';

export default createReducer(initialState, (builder) => {
  builder
    .addCase(HYDRATE, (state, { payload }) => ({ ...payload.search }))
    .addCase(actions.setSearchSelected, (state, { payload }) => ({
      ...state,
      staticData: payload,
    }))
    .addCase(actions.setSearchList, (state, { payload }) => ({
      ...state,
      list: payload,
    }))
    .addCase(actions.setSearchTerm, (state, { payload }) => ({
      ...state,
      term: payload,
    }))
    .addCase(actions.setSearchPage, (state, { payload }) => ({
      ...state,
      page: payload,
    }))
    .addCase(actions.setSearchTotal, (state, { payload }) => ({
      ...state,
      total: payload,
    }))
    .addCase(actions.setSearchLoading, (state, { payload }) => ({
      ...state,
      loading: payload,
    }))
    .addCase(actions.setSearchError, (state, { payload }) => ({
      ...state,
      error: payload,
    }));
});

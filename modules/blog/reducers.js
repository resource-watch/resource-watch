import { createReducer } from '@reduxjs/toolkit';
import {
  HYDRATE,
} from 'next-redux-wrapper';

import * as actions from './actions';
import initialState from './initial-state';

export default createReducer(initialState, (builder) => {
  builder
    .addCase(HYDRATE, (state, { payload }) => ({ ...payload.blog }))
    .addCase(actions.setLatestPosts, (state, { payload }) => ({
      ...state,
      latestPosts: payload,
    }))
    .addCase(actions.setLatestPostsError, (state, { payload }) => ({
      ...state,
      latestPostsError: payload,
    }))
    .addCase(actions.setSpotlightPosts, (state, { payload }) => ({
      ...state,
      spotlightPosts: payload,
    }))
    .addCase(actions.setSpotlightPostsError, (state, { payload }) => ({
      ...state,
      spotlightPostsError: payload,
    }));
});

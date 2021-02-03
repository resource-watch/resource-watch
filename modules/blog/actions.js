import { createAction, createThunkAction } from 'redux-tools';

// services
import { fetchPosts } from 'services/blog';

// utils
import { postParser } from 'utils/blog';

// constants
import { SPOTLIGHT_CATEGORY, ERROR_MESSAGE_FETCH_POSTS, UNCATEGORIZED_CATEGORY } from 'constants/blog';

export const setLatestPosts = createAction('BLOG/SET_LATEST_POSTS');
export const setLatestPostsError = createAction('BLOG/SET_LATEST_POSTS_ERROR');
export const setSpotlightPosts = createAction('BLOG/SET_SPOTLIGHT_POSTS');
export const setSpotlightPostsError = createAction('BLOG/SET_SPOTLIGHT_POSTS_ERROR');

export const getLatestPosts = createThunkAction('BLOG/GET_LATEST_POSTS', () => (dispatch) => {
  dispatch(setLatestPostsError(null));

  return fetchPosts({
    _embed: true,
    per_page: 3,
    categories_exclude: [...SPOTLIGHT_CATEGORY, UNCATEGORIZED_CATEGORY],
  })
    .then((posts) => { dispatch(setLatestPosts(postParser(posts))); })
    .catch(() => { dispatch(setLatestPostsError(ERROR_MESSAGE_FETCH_POSTS)); });
});

export const getSpotlightPosts = createThunkAction('BLOG_POSTS_LATEST_FETCH_DATA', () => (dispatch) => {
  dispatch(setSpotlightPostsError(null));

  return fetchPosts({
    _embed: true,
    per_page: 3,
    categories: SPOTLIGHT_CATEGORY.join(','),
  })
    .then((posts) => { dispatch(setSpotlightPosts(postParser(posts))); })
    .catch(() => { dispatch(setSpotlightPostsError(ERROR_MESSAGE_FETCH_POSTS)); });
});

export default {
  getLatestPosts,
  getSpotlightPosts,
};

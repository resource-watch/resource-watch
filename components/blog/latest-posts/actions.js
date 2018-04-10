import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import moment from 'moment';
import renderHTML from 'react-render-html';

// Actions
export const setPosts = createAction('BLOG_POSTS_LATEST_GET');
export const setPostsLoading = createAction('BLOG_POSTS_LATEST_LOADING');
export const setPostsError = createAction('BLOG_POSTS_LATEST_ERROR');
export const setSelected = createAction('BLOG_POSTS_LATEST_SELECTED');

export const setPostsSpotlight = createAction('BLOG_POSTS_SPOTLIGHT_LATEST_GET');
export const setPostsSpotlightLoading = createAction('BLOG_POSTS_SPOTLIGHT_LATEST_LOADING');
export const setPostsSpotlightError = createAction('BLOG_POSTS_SPOTLIGHT_LATEST_ERROR');

// Featured posts
const SPOTLIGHT_CATEGORY = 15;

// Async actions
export const fetchBlogPostsLatest = createThunkAction('BLOG_POSTS_LATEST_FETCH_DATA', () => (dispatch) => {
  dispatch(setPostsLoading(true));
  dispatch(setPostsError(null));
  return fetch(new Request(`${process.env.BLOG_API_URL}/posts?_embed&per_page=3&categories_exclude=${SPOTLIGHT_CATEGORY}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then((response) => {
      const posts = response.map((p) => {
        const author = p._embedded.author && p._embedded.author[0];
        const media = p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0];
        return {
          date: moment(p.date).format('MMM DD, YYYY'),
          title: renderHTML(p.title.rendered),
          link: p.link,
          slug: p.slug,
          author: author && {
            img: author.avatar_urls['96'],
            path: author.link,
            name: author.name
          },
          image: media && media.media_details && media.media_details.sizes.medium_large.source_url,
          description: p.except ? p.excerpt.rendered : p.content.rendered
        };
      });
      dispatch(setPostsLoading(false));
      dispatch(setPostsError(null));
      dispatch(setPosts(posts));
    })
    .catch((err) => {
      dispatch(setPostsLoading(false));
      dispatch(setPostsError(err));
    });
});

export const fetchBlogPostsSpotlightLatest = createThunkAction('BLOG_POSTS_LATEST_SPOTLIGHT_FETCH_DATA', () => (dispatch) => {
  dispatch(setPostsSpotlightLoading(true));
  dispatch(setPostsSpotlightError(null));
  return fetch(new Request(`${process.env.BLOG_API_URL}/posts?_embed&per_page=3&categories=${SPOTLIGHT_CATEGORY}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then((response) => {
      const posts = response.map((p) => {
        const author = p._embedded.author && p._embedded.author[0];
        const media = p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0];
        return {
          date: moment(p.date).format('MMM DD, YYYY'),
          title: renderHTML(p.title.rendered),
          link: p.link,
          slug: p.slug,
          author: author && {
            img: author.avatar_urls['96'],
            path: author.link,
            name: author.name
          },
          image: media && media.media_details && media.media_details.sizes.medium_large.source_url,
          description: p.except ? p.excerpt.rendered : p.content.rendered
        };
      });
      dispatch(setPostsSpotlightLoading(false));
      dispatch(setPostsSpotlightError(null));
      dispatch(setPostsSpotlight(posts));
    })
    .catch((err) => {
      dispatch(setPostsSpotlightLoading(false));
      dispatch(setPostsSpotlightError(err));
    });
});

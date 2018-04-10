import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import moment from 'moment';
import renderHTML from 'react-render-html';

// Actions
export const setBlogPostsLatest = createAction('BLOG_POSTS_LATEST_GET');
export const setBlogPostsSpotlightLatest = createAction('BLOG_POSTS_SPOTLIGHT_LATEST_GET');
export const setLoading = createAction('BLOG_POSTS_LATEST_LOADING');
export const setError = createAction('BLOG_POSTS_LATEST_ERROR');
export const setSelected = createAction('BLOG_POSTS_LATEST_SELECTED');

// Featured posts
const SPOTLIGHT_CATEGORY = 15;

// Async actions
export const fetchBlogPostsLatest = createThunkAction('BLOG_POSTS_LATEST_FETCH_DATA', (payload = {}) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
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
          image: media && media.media_details.sizes.medium_large.source_url,
          description: p.except ? p.excerpt.rendered : p.content.rendered
        };
      });
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setBlogPostsLatest(posts));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});

export const fetchBlogPostsSpotlightLatest = createThunkAction('BLOG_POSTS_LATEST_SPOTLIGHT_FETCH_DATA', (payload = {}) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
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
          image: media && media.media_details.sizes.large.source_url,
          description: p.except ? p.excerpt.rendered : p.content.rendered
        };
      });
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setBlogPostsSpotlightLatest(posts));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});

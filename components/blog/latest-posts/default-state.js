import moment from 'moment';
import renderHTML from 'react-render-html';

import { POSTS } from './posts';
import { POSTS_SPOTLIGHT } from './postsSpotlight';

export default {
  posts: POSTS.map((p) => {
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
      image: media &&
             media.media_details &&
             media.media_details.sizes &&
             media.media_details.sizes.medium_large &&
             media.media_details.sizes.medium_large.source_url,
      description: p.except ? p.excerpt.rendered : p.content.rendered
    };
  }),
  postsLoading: false,
  postsError: null,

  postsSpotlight: POSTS_SPOTLIGHT.map((p) => {
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
      image: media &&
             media.media_details &&
             media.media_details.sizes &&
             media.media_details.sizes.medium_large &&
             media.media_details.sizes.medium_large.source_url,
      description: p.except ? p.excerpt.rendered : p.content.rendered
    };
  }),
  postsSpotlightLoading: false,
  postsSpotlightError: null
};

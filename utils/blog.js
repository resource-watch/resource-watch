import moment from 'moment';
import renderHTML from 'react-render-html';

export const postParser = (posts = []) => posts.map((post) => {
  const author = post._embedded.author && post._embedded.author[0];
  const media = post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0];

  return ({
    date: moment(post.date).format('MMM DD, YYYY'),
    title: renderHTML(post.title.rendered),
    link: post.link,
    slug: post.slug,
    author: author && {
      img: author.avatar_urls['96'],
      path: author.link,
      name: author.name,
    },
    image: media && media.media_details && media.media_details.sizes
      && media.media_details.sizes.full
      && media.media_details.sizes.full.source_url,
    description: post.except ? post.excerpt.rendered : post.content.rendered,
  });
});

export default { postParser };

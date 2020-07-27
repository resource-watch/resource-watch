import React from 'react';
import classnames from 'classnames';
import { useQuery } from 'react-query';

import { fetchPosts } from 'services/blog';
import { SPOTLIGHT_CATEGORY, ERROR_MESSAGE_FETCH_POSTS, UNCATEGORIZED_CATEGORY } from 'constants/blog';
import { postParser } from 'utils/blog';

// components
import CardStatic from 'components/app/common/CardStatic';
import Rating from '../rating';

const fetchLatestPosts = () => fetchPosts({
  _embed: true,
  per_page: 3,
  categories_exclude: [...SPOTLIGHT_CATEGORY, UNCATEGORIZED_CATEGORY]
})
  .then(posts => postParser(posts))
  .catch(() => ERROR_MESSAGE_FETCH_POSTS);

const fetchSpotlights = () => fetchPosts({
  _embed: true,
  per_page: 3,
  categories: SPOTLIGHT_CATEGORY.join(',')
})
  .then(posts => postParser(posts))
  .catch(() => ERROR_MESSAGE_FETCH_POSTS);


const BlogFeed = () => {
  const { data: latestPosts, error: latestPostsError } = useQuery('latest-posts', fetchLatestPosts, { initialData: [], initialStale: true });
  const { data: spotlightPosts, error: spotlightPostsError } = useQuery('spotlights', fetchSpotlights, { initialData: [], initialStale: true });


  const errors = latestPostsError !== null || spotlightPostsError !== null;

  const getCard = (post = {}) => {
    const {
      title,
      image,
      link,
      date,
      author: { path, name, img: authorImage },
      ranking
    } = post;
    const clardClass = classnames('-alt', { '-clickable': !!link });

    return (
      <CardStatic
        key={`insight-card-${title}`}
        className={clardClass}
        background={`url(${image})`}
        clickable={!!link}
        {...link && { route: link }}
        anchor
      >
        <div>
          <h4>{date}</h4>
          <h3>{title}</h3>
        </div>
        <div className="footer">
          <div className="source">
            <span style={{ backgroundImage: `url(${authorImage}` }} />
            <div className="source-name">
              by <a href={path} target="_blank" rel="noopener noreferrer">{name}</a>
            </div>
          </div>
          {ranking && (<Rating rating={ranking} />)}
        </div>
      </CardStatic>
    );
  };

  return (
    <div className="c-blog-feed">
      {errors && (
        <div className="error">
          {latestPostsError || spotlightPostsError}
        </div>
      )}
      {!errors && (!!latestPosts.length && !!spotlightPosts.length) && (
        <div className="insight-cards">
          <div className="row">
            <div className="column small-12 medium-8">
              {spotlightPosts.length ?
                getCard(spotlightPosts[0]) :
                getCard(latestPosts[2])
              }
            </div>
            <div className="column small-12 medium-4">
              <div className="dual">
                {getCard(latestPosts[0])}
                {getCard(latestPosts[1])}
              </div>
            </div>
          </div>
        </div>)}
    </div>
  );
};

export default BlogFeed;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';

class BlogFeed extends PureComponent {
  static propTypes = {
    latestPosts: PropTypes.array.isRequired,
    spotlightPosts: PropTypes.array.isRequired,
    latestPostsError: PropTypes.string,
    spotlightPostsError: PropTypes.string,
    getLatestPosts: PropTypes.func.isRequired,
    getSpotlightPosts: PropTypes.func.isRequired
  };

  static defaultProps = {
    latestPostsError: null,
    spotlightPostsError: null
  }

  getCard = (post = {}) => {
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

  render() {
    const {
      latestPosts,
      spotlightPosts,
      latestPostsError,
      spotlightPostsError
    } = this.props;

    const errors = latestPostsError !== null || spotlightPostsError !== null;

    return (
      <div className="c-blog-feed">
        {errors && (
          <div className="error">
            {latestPostsError || spotlightPostsError}
          </div>
        )}
        {!errors && (!!latestPosts.length && !!spotlightPosts.length) && (
          <div className="row">
            <div className="column small-12 medium-8">
              {spotlightPosts.length ?
                this.getCard(spotlightPosts[0]) :
                this.getCard(latestPosts[2])
              }
            </div>
            <div className="column small-12 medium-4">
              <div className="dual">
                {this.getCard(latestPosts[0])}
                {this.getCard(latestPosts[1])}
              </div>
            </div>
          </div>)
        }
      </div>
    );
  }
}

export default BlogFeed;

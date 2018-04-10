import React from 'react';
import PropTypes from 'prop-types';

import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';
import Spinner from 'components/ui/Spinner';

class BlogPostsLatest extends React.Component {
  static propTypes = {
    posts: PropTypes.array,
    postsLoading: PropTypes.bool,
    postsSpotlight: PropTypes.array,
    postsSpotlightLoading: PropTypes.bool,

    fetchBlogPostsLatest: PropTypes.func,
    fetchBlogPostsSpotlightLatest: PropTypes.func
  };

  static defaultProps = {
    posts: []
  };

  componentDidMount() {
    // this.props.fetchBlogPostsLatest();
    // this.props.fetchBlogPostsSpotlightLatest();
  }

  getCard = p => (
    p && (
      <CardStatic
        key={`insight-card-${p.title}`}
        className={`-alt ${p.link ? '-clickable' : ''}`}
        background={`url(${p.image})`}
        clickable={!!p.link}
        route={p.link ? p.link : ''}
        anchor
      >
        <div>
          <h4>{p.date}</h4>
          <h3>{p.title}</h3>
        </div>
        <div className="footer">
          <div className="source">
            <span style={{ backgroundImage: `url(${p.author.img}` }} />
            <div className="source-name">
              by <a href={p.author.path} target="_blank">{p.author.name}</a>
            </div>
          </div>
          {p.ranking && <Rating rating={p.ranking} />}
        </div>
      </CardStatic>
    )
  );

  render() {
    const {
      posts, postsLoading, postsSpotlight, postsSpotlightLoading
    } = this.props;

    return (
      <div className="c-blog-latest-posts insight-cards">
        {postsLoading && postsSpotlightLoading &&
          <Spinner className="-light" isLoading />
        }
        {!postsLoading && !!posts.length && !!postsSpotlight.length &&
          <div className="row">
            <div className="column small-12 medium-8">
              {postsSpotlight.length ?
                this.getCard(postsSpotlight[0]) :
                this.getCard(posts[2])
              }
            </div>
            <div className="column small-12 medium-4">
              <div className="dual">
                {this.getCard(posts[0])}
                {this.getCard(posts[1])}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default BlogPostsLatest;

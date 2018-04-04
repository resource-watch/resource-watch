import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';

class BlogPostsLatest extends React.Component {
  componentDidMount() {
    const { fetchBlogPostsLatest } = this.props;
    fetchBlogPostsLatest();
  }

  getCard = p => (
    p && (
      <CardStatic
        key={`insight-card-${p.slug}`}
        className={`-alt ${p.link ? '-clickable' : ''}`}
        background={`url(${p.image})`}
        clickable={!!p.link}
        route={p.link ? p.link : ''}
      >
        <div>
          <h4>{p.date}</h4>
          <h3>
            { p.link ?
              <Link route={`/blog/${p.slug}`}>
                <a>{p.title}</a>
              </Link>
              :
              <span>{p.title}</span>
            }
          </h3>
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
    const { posts } = this.props;
    return posts.length ? (
      <div className="c-blog-latest-posts insight-cards">
        <div className="row">
          <div className="column small-12 medium-8">
            {this.getCard(posts[0])}
          </div>
          <div className="column small-12 medium-4">
            <div className="dual">
              {this.getCard(posts[1])}
              {this.getCard(posts[2])}
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}

BlogPostsLatest.propTypes = {
  posts: PropTypes.array,
  fetchBlogPostsLatest: PropTypes.func
};

BlogPostsLatest.defaultProps = {
  posts: []
};

export default BlogPostsLatest;

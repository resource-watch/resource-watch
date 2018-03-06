import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';

function TopicsListCard({ topic, routes, onDelete }) {
  return (
    <div className="c-card">
      <div className="card-container">
        <header className="card-header">
          <Link
            route={routes.detail}
            params={{ tab: 'topics', id: topic.id }}
          >
            <a>
              <Title className="-default">
                {topic.name}
              </Title>
            </a>
          </Link>
        </header>

        <div className="card-content">
          <div className="card-actions">
            <a
              className="c-button -tertiary -compressed"
              target="_blank"
              href={`/data/topics/${topic.slug}`}
            >
              Preview
            </a>

            <button
              className="c-button -tertiary -compressed"
              onClick={() => onDelete(topic)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

TopicsListCard.defaultProps = {
  routes: {
    index: '',
    detail: ''
  },
  topic: {},
  onDelete: null
};

TopicsListCard.propTypes = {
  topic: PropTypes.object,
  routes: PropTypes.object,
  onDelete: PropTypes.func
};

export default TopicsListCard;

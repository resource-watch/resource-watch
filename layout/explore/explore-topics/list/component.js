import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

function TopicsListComponent(props) {
  const { topics, onClick } = props;

  return (
    <div className="c-topics-list">
      <div className="row">
        {topics.map(topic => (
          <div className="column small-6">
            <div
              id={topic.id}
              className="topic-button"
              role="button"
              tabIndex={0}
              onClick={() => onClick(topic.id)}
              onKeyPress={() => onClick(topic.id)}
            >
              <div
                className="topic-image"
                style={{
                  background: `linear-gradient(${topic.backgroundColor},${topic.backgroundColor}),
                    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.30)),url(${topic.backgroundURL})`,
                  'background-position': 'center',
                  'background-size': 'cover'
                }}
              />
              <div className="topic-title">
                {topic.label}
              </div>
            </div>
          </div>
                ))}
      </div>
    </div>
  );
}

TopicsListComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
  topics: PropTypes.array.isRequired
};

export default TopicsListComponent;

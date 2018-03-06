import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function TopicThumbnailList({
  topics,
  selected,
  onSelect
}) {
  return (
    <div className="c-topics-thumbnail-list">
      <div className="row l-row -equal-height">
        {
          topics.map(topic => (
            <div key={topic.slug} className="column small-12 medium-6 large-3">
              <button
                key={topic.slug}
                tabIndex="0"
                className={classnames({
                  'thumbnail-list-item': true,
                  '-active': topic.slug === selected
                })}
                style={{
                  backgroundImage: `url(${topic.photo.original})`
                }}
                onClick={() => onSelect(topic)}
              >
                <div className="content" htmlFor={`topic-${topic.slug}`}>
                  {topic.name}
                </div>
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

TopicThumbnailList.propTypes = {
  topics: PropTypes.array,
  selected: PropTypes.string,
  onSelect: PropTypes.func
};

TopicThumbnailList.defaultProps = {
  topics: [],
  selected: ''
};

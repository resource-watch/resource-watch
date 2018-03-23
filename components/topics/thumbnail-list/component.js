import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function TopicThumbnailList({
  topics,
  selected,
  onSelect,
  portraitMode
}) {
  return (
    <div className="c-topics-thumbnail-list">
      <div className="row l-row -equal-height">
        {
          topics.map(topic => (
            <div
              key={topic.slug}
              className={classnames({
                column: true,
                'small-12': true,
                'medium-6': !portraitMode,
                'large-3': !portraitMode,
                'large-2': portraitMode,
                'medium-3': portraitMode,
                'small-4': portraitMode
              })}
            >
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
  onSelect: PropTypes.func,
  portraitMode: PropTypes.bool
};

TopicThumbnailList.defaultProps = {
  topics: [],
  selected: '',
  portraitMode: false
};

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function TopicThumbnailList({
  topics,
  total,
  selected,
  pagination,
  expanded,
  add,
  onSelect,
  onAdd,
  onExpand
}) {
  return (
    <ul className="c-topic-thumbnail-list">
      {
        topics.map(topic => (
          <li
            key={topic.slug}
            role="button"
            tabIndex="0"
            className={classnames({
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
          </li>
        ))
      }

      {!pagination && add &&
        <li
          className="-toggle"
          role="button"
          tabIndex="0"
          onClick={() => onAdd()}
        >
          <div className="content">
            New
          </div>
        </li>
      }

      {pagination && total > 5 &&
        <li
          className="-toggle"
          role="button"
          tabIndex="0"
          onClick={() => onExpand(!expanded)}
        >
          <div className="content">
            {expanded ? 'Close' : 'More'}
          </div>
        </li>
      }
    </ul>
  );
}

TopicThumbnailList.propTypes = {
  topics: PropTypes.array,
  total: PropTypes.number,
  pagination: PropTypes.bool,
  add: PropTypes.bool,
  selected: PropTypes.string,
  expanded: PropTypes.bool,
  onSelect: PropTypes.func,
  onExpand: PropTypes.func,
  onAdd: PropTypes.func
};

TopicThumbnailList.defaultProps = {
  topics: [],
  selected: '',
  expanded: false,
  add: false
};

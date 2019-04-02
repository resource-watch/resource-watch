import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class TopicThumbnail extends PureComponent {
  static propTypes = {
    topic: PropTypes.object.isRequired,
    portraitMode: PropTypes.bool,
    selected: PropTypes.string,
    onSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    portraitMode: false,
    selected: null
  }

  render() {
    const {
      topic,
      portraitMode,
      selected,
      onSelect
    } = this.props;

    return (
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
            'dashboard-thumbnail': true,
            '-active': topic.slug === selected
          })}
          style={{ backgroundImage: `url(${topic.photo.medium})` }}
          onClick={() => onSelect(topic)}
        >
          <div className="content" htmlFor={`topic-${topic.slug}`}>
            {topic.name}
          </div>
        </button>
      </div>
    );
  }
}

export default TopicThumbnail;

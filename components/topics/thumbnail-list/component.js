import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TopicThumbnail from 'components/topics/thumbnail/component';

class TopicThumbnailList extends PureComponent {
  static propTypes = {
    topics: PropTypes.array.isRequired,
    selected: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    portraitMode: PropTypes.bool
  }

  static defaultProps = {
    portraitMode: false,
    selected: null
  }

  render() {
    const {
      topics,
      portraitMode,
      selected,
      onSelect
    } = this.props;

    return (
      <div className="c-topics-thumbnail-list">
        <div className="row l-row -equal-height">
          {
            topics.map(topic => (
              <TopicThumbnail
                topic={topic}
                onSelect={onSelect}
                portraitMode={portraitMode}
                selected={selected}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

export default TopicThumbnailList;

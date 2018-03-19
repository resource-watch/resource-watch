import React from 'react';
import PropTypes from 'prop-types';

// Components
import Tag from 'components/ui/Tag';

class DatasetTagsTooltip extends React.Component {
  static propTypes = {
    tags: PropTypes.array.isRequired
  };

  render() {
    const { tags } = this.props;

    return (
      <div className="c-dataset-tags-tooltip">
        <div className="c-tag-list">
          {tags.map(tag => (
            <Tag
              className="-primary"
              key={tag.id}
              name={tag.label}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default DatasetTagsTooltip;

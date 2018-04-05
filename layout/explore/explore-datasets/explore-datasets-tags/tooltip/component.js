import React from 'react';
import PropTypes from 'prop-types';

// Components
import Tag from 'components/ui/Tag';

class DatasetTagsTooltip extends React.Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    onTagSelected: PropTypes.func
  };

  render() {
    const { tags, onTagSelected } = this.props;

    return (
      <div className="c-dataset-tags-tooltip">
        <div className="c-tag-list">
          {tags.map(tag => (
            <Tag
              className="-primary"
              key={tag.id}
              name={tag.label}
              onClick={() => onTagSelected(tag)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default DatasetTagsTooltip;

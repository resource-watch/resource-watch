import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

class DatasetTagsTooltip extends React.Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  render() {
    const { tags } = this.props;
    return (
      <div className="c-dataset-tags-tooltip">
        {tags && tags.map(tag => (
          <div
            className="tag"
            role="button"
            tabIndex={-1}
            key={tag.id}
            onClick={this.props.onTagClick}
          >
            {tag.label}
          </div>))
        }
      </div>
    );
  }
}

DatasetTagsTooltip.propTypes = {
  toggleTooltip: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  // Callbacks
  onTagClick: PropTypes.func.isRequired
};

export default DatasetTagsTooltip;

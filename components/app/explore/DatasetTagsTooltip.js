import React from 'react';
import PropTypes from 'prop-types';

class DatasetTagsTooltip extends React.Component {
  constructor(props) {
    super(props);

    // ------------------- Bindings -----------------------
    this.triggerMouseDown = this.triggerMouseDown.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

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
            id={tag.id}
            data-type={tag.labels
              .find(t => t === 'DATA_TYPE' || t === 'GEOGRAPHY' || t === 'TOPIC')}
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

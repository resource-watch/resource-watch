import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class LayerPillComponent extends PureComponent {
  render() {
    const { labelsPulse, url, label } = this.props;
    const { labelsLayerActive } = labelsPulse;

    const className = classnames({
      'labels-pill': true,
      'c-button': true,
      '-secondary': !labelsLayerActive,
      '-primary': labelsLayerActive,
      '-active': labelsLayerActive
    });

    return (
      <button
        className={className}
        onClick={() => {
          this.props.toggleLabelsLayer(url);
        }}
      >
        {label}
      </button>
    );
  }
}

LayerPillComponent.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  // Store
  labelsPulse: PropTypes.object.isRequired,
  toggleLabelsLayer: PropTypes.func.isRequired
};

export default LayerPillComponent;

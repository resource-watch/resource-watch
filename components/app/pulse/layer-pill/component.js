import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class LayerPillComponent extends PureComponent {
  render() {
    const { contextLayersPulse, layerId, label } = this.props;
    const contextLayer = contextLayersPulse.contextLayers &&
      contextLayersPulse.contextLayers.find(l => l === layerId);

    const className = classnames({
      'layer-pill': true,
      'c-button': true,
      '-secondary': !contextLayer,
      '-primary': contextLayer,
      '-active': contextLayer
    });

    return (
      <button
        className={className}
        onClick={() => {
          this.props.toggleContextualLayer(layerId);
        }}
      >
        {label}
      </button>
    );
  }
}

LayerPillComponent.propTypes = {
  layerId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  // Store
  contextLayersPulse: PropTypes.object.isRequired,
  toggleContextualLayer: PropTypes.func.isRequired
};

export default LayerPillComponent;

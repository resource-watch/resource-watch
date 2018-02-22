import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class LayerPillComponent extends PureComponent {
  render() {
    const { layerActive, layerId, label } = this.props;
    const contextLayer = layerActive && layerActive.contextLayers &&
      layerActive.contextLayers.find(ctxL => ctxL.attributes.id === layerId);

    const className = classnames({
      'layer-pill': true,
      'c-button': true,
      '-secondary': contextLayer && !contextLayer.active,
      '-primary': contextLayer && contextLayer.active,
      '-active': contextLayer && contextLayer.active
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
  layerActive: PropTypes.object.isRequired,
  toggleContextualLayer: PropTypes.func.isRequired
};

export default LayerPillComponent;

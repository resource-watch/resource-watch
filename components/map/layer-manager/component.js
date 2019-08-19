import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LayerManager as VizzLayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';

class LayerManager extends PureComponent {
  static propTypes = {
    map: PropTypes.object.isRequired,
    layers: PropTypes.array
  }

  static defaultProps = { layers: [] }

  render() {
    const {
      map,
      layers
    } = this.props;

    return (
      <VizzLayerManager
        map={map}
        plugin={PluginMapboxGl}
      >
        {layers.map(_layer => (
          <Layer
            key={_layer.id}
            {..._layer}
          />
        ))}
      </VizzLayerManager>
    );
  }
}

export default LayerManager;

import React from 'react';
import PropTypes from 'prop-types';

// Components
import RadioGroup from 'components/form/RadioGroup';

class LegendLayersTooltip extends React.Component {
  static propTypes = {
    // Layers
    layers: PropTypes.array.isRequired,
    activeLayer: PropTypes.object.isRequired,
    // Callback to call when the layer changes with
    // the ID of the dataset and the ID of the layer
    onChangeLayer: PropTypes.func.isRequired
  };

  render() {
    const { layers, activeLayer } = this.props;

    const options = layers.map(layer => ({
      label: layer.name,
      value: layer.id,
      dataset: layer.dataset
    }));

    return (
      <div className="c-explore-layers-tooltip">
        <h4>
          Layers
        </h4>

        <RadioGroup
          name="layers"
          properties={{ default: activeLayer.id }}
          options={options}
          onChange={id =>
            this.props.onChangeLayer(layers.find(l => l.id === id))
          }
        />
      </div>
    );
  }
}

export default LegendLayersTooltip;

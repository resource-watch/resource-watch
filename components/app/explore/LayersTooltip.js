import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import RadioGroup from 'components/form/RadioGroup';

class LayersTooltip extends React.Component {

  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  @Autobind
  onMouseDown(e) {
    const clickOutside = this.el && this.el.contains && !this.el.contains(e.target);
    if (clickOutside) {
      this.props.onClose();
    }
  }

  render() {
    const options = this.props.layerGroup.layers.map(layer => ({
      label: layer.name,
      value: layer.id
    }));

    const activeLayer = this.props.layerGroup.layers.find(l => l.active);

    return (
      <div className="c-explore-layers-tooltip" ref={(node) => { this.el = node; }}>
        <RadioGroup
          name="layers"
          properties={{ default: activeLayer.id }}
          options={options}
          onChange={layer => this.props.onChangeLayer(this.props.layerGroup.dataset, layer)}
        />
      </div>
    );
  }
}

LayersTooltip.propTypes = {
  // Layer group
  layerGroup: PropTypes.object.isRequired,
  // Callback to call when the layer changes with
  // the ID of the dataset and the ID of the layer
  onChangeLayer: PropTypes.func.isRequired,
  // Callback to close the tooltip
  onClose: PropTypes.func.isRequired
};

export default LayersTooltip;

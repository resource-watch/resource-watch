import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayerCard from './layer-card';

// styles
import './styles.scss';

class SortingLayerManager extends PureComponent {
  static propTypes = {
    layers: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  }

  state = { layers: this.props.layers }

  handleOnDragStart = (e, index) => {
    this.draggedLayer = this.state.layers[index];
  };

  handleOnDragEnd = () => {
    this.draggedLayer = null;
  }

  handleOnDragOver = (index) => {
    const draggedOverLayer = this.state.layers[index];

    // if the layer is dragged over itself, ignore
    if (this.draggedLayer === draggedOverLayer) {
      return;
    }

    // filter out the currently dragged item
    const layers = this.state.layers.filter(layer => layer !== this.draggedLayer);

    // add the dragged layer after the dragged over layer
    layers.splice(index, 0, this.draggedLayer);

    this.setState({ layers }, () => this.props.onChange(layers));
  }

  render() {
    const { layers } = this.state;

    return (
      <div className="c-sorting-layer-manager">
        <ul className="sorting-layer-manager-list">
          {layers.map((layer, index) => (
            <LayerCard
              key={layer.id}
              index={index}
              layer={layer}
              onDragStart={this.handleOnDragStart}
              onDragEnd={this.handleOnDragEnd}
              onDragOver={this.handleOnDragOver}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default SortingLayerManager;

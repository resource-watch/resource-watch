import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import PublishedLayerCard from 'components/datasets/metadata/form/published-layer/card/PublishedLayerCard';

// styles
import './styles.scss';

class PublishedLayersList extends PureComponent {
  propTypes = {
    layers: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { layers: props.layers };
  }

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
      <div className="c-published-layer-list">
        {layers.map((layer, index) => (
          <PublishedLayerCard
            key={layer.id}
            index={index}
            layer={layer}
            onDragStart={this.handleOnDragStart}
            onDragEnd={this.handleOnDragEnd}
            onDragOver={this.handleOnDragOver}
          />
        ))}
      </div>
    );
  }
}

export default PublishedLayersList;

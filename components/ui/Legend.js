import React from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import LegendType from 'components/ui/LegendType';
import Icon from 'components/ui/Icon';
import Switch from 'components/ui/Switch';
import LayerInfoModal from 'components/modal/LayerInfoModal';

const SortableItem = SortableElement(({ value }) => value);

const DragHandle = SortableHandle(() => (
  <span className="handler">
    <Icon name="icon-drag-dots" className="-small" />
  </span>
));

const SortableList = SortableContainer(({ items }) => (
  <ul className="legend-list">
    {items.map((value, index) =>
      <SortableItem key={`item-${index}`} index={index} value={value} />
    )}
  </ul>
));

class Legend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    };

    // BINDINGS
    this.onSortEnd = this.onSortEnd.bind(this);
    this.onSortStart = this.onSortStart.bind(this);
    this.onSortMove = this.onSortMove.bind(this);
  }

  onSortEnd({ oldIndex, newIndex }) {
    const reversed = this.props.layersActive.reverse();
    const newLayersOrder = arrayMove(reversed, oldIndex, newIndex);
    // Unreverse layers to set them in their real order
    const newLayersActive = newLayersOrder.map(l => l.dataset).reverse();

    this.props.setDatasetsActive(newLayersActive);
  }

  onSortStart(opts) {
    // const node = opts.node;
  }

  onSortMove(ev) {
  }

  onDeactivateLayer(dataset) {
    this.props.toggleDatasetActive(dataset);
    this.props.layersHidden.includes(dataset) && this.onHideLayer(dataset);
  }

  onHideLayer(dataset) {
    let newLayersHidden = this.props.layersHidden.slice();
    this.props.layersHidden.includes(dataset) ?
      newLayersHidden = this.props.layersHidden.filter(l => l !== dataset) :
      newLayersHidden.push(dataset);

    this.props.setDatasetsHidden(newLayersHidden);
  }

  onLayerInfoModal(layer) {
    const options = {
      children: LayerInfoModal,
      childrenProps: {
        data: layer
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  getItemsActions(layer) {
    return (
      <div className="item-actions">
        <button className="info" onClick={() => this.onLayerInfoModal(layer)}>
          <Icon name="icon-info" className="-smaller" />
        </button>
        <Switch
          onChange={() => this.onHideLayer(layer.dataset)}
          active={!layer.hidden}
          classNames="-secondary"
        />
        <button className="close" onClick={() => this.onDeactivateLayer(layer.dataset)}>
          <Icon name="icon-cross" className="-smaller" />
        </button>
      </div>
    );
  }

  getLegendItems() {
    // Reverse layers to show first the last one added
    const layersActiveReversed = this.props.layersActive.slice().reverse();
    return layersActiveReversed.map((layer, i) => (
      <li key={i} className="c-legend-unit">
        <div className="legend-info">
          <header className="legend-item-header">
            <h3 className={this.props.className.color}>
              <span className="name">{layer.name}</span>
            </h3>
            {this.getItemsActions(layer)}
          </header>
          <LegendType config={layer.legendConfig} className={this.props.className} />
        </div>
        <DragHandle />
      </li>
    ));
  }

  render() {
    return (
      <div className="c-legend-map">
        <div className={`open-legend ${this.state.open ? '-active' : ''}`}>
          <h1 className="legend-title">
            Legend
            <button className="toggle-legend" onClick={() => this.setState({ open: false })}>
              <Icon name="icon-arrow-down" className="-small" />
            </button>
          </h1>
          <SortableList
            items={this.getLegendItems()}
            helperClass="c-legend-unit -sort"
            onSortEnd={this.onSortEnd}
            onSortStart={this.onSortStart}
            onSortMove={this.onSortMove}
            axis="y"
            lockAxis="y"
            lockToContainerEdges
            lockOffset="50%"
            useDragHandle
          />
        </div>
        <div className={`close-legend ${!this.state.open ? '-active' : ''}`}>
          <h1 className="legend-title">
            Legend
            <button className="toggle-legend" onClick={() => this.setState({ open: true })}>
              <Icon name="icon-arrow-up" className="-small" />
            </button>
          </h1>
        </div>
      </div>
    );
  }
}

Legend.propTypes = {
  layersActive: React.PropTypes.array,
  layersHidden: React.PropTypes.array,
  className: React.PropTypes.object,

  // Functions
  toggleDatasetActive: React.PropTypes.func,
  setDatasetsActive: React.PropTypes.func,
  toggleModal: React.PropTypes.func,
  setModalOptions: React.PropTypes.func,
  setDatasetsHidden: React.PropTypes.func
};

export default Legend;

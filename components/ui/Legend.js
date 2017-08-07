import React from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

// Components
import LegendType from 'components/ui/LegendType';
import Icon from 'components/ui/Icon';
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
      <SortableItem key={value.key} index={index} value={value} />
    )}
  </ul>
));

class Legend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.expanded
    };

    // BINDINGS
    this.onSortEnd = this.onSortEnd.bind(this);
    // this.onSortStart = this.onSortStart.bind(this);
    // this.onSortMove = this.onSortMove.bind(this);
  }

  onSortEnd({ oldIndex, newIndex }) {
    const reversed = this.props.layersActive.reverse();
    const newLayersOrder = arrayMove(reversed, oldIndex, newIndex);
    // Unreverse layers to set them in their real order
    const newLayersActive = newLayersOrder.map(l => l.dataset).reverse();

    this.props.setDatasetsActive(newLayersActive);
  }

  // onSortStart(opts) {
  //   // const node = opts.node;
  // }

  // onSortMove(ev) {
  // }

  onDeactivateLayer(dataset) {
    this.props.toggleDatasetActive(dataset);
    if (this.props.layersHidden.includes(dataset)) {
      this.onHideLayer(dataset);
    }
  }

  onHideLayer(dataset) {
    let newLayersHidden = this.props.layersHidden.slice();
    if (this.props.layersHidden.includes(dataset)) {
      newLayersHidden = this.props.layersHidden.filter(l => l !== dataset);
    } else {
      newLayersHidden.push(dataset);
    }

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

  /**
   * Event handler executed when the user clicks the button
   * to change the opacity of a layer
   */
  onClickOpacity() { // eslint-disable-line class-methods-use-this
    // TODO: implement
    alert('Not implemented yet'); // eslint-disable-line no-alert
  }

  /**
   * Event handler executed when the user clicks the button
   * to switch the layer for another one of the same dataset
   */
  onClickLayers() { // eslint-disable-line class-methods-use-this
    // TODO: implement
    alert('Not implemented yet'); // eslint-disable-line no-alert
  }

  getItemsActions(layer) {
    return (
      <div className="item-actions">
        <button className="layers" onClick={() => this.onClickLayers()} aria-label="Select other layer">
          <Icon name="icon-layers" />
        </button>
        <button className="opacity" onClick={() => this.onClickOpacity()} aria-label="Change opacity">
          <Icon name="icon-opacity" />
        </button>
        { !this.props.readonly && (
          <button className="toggle" onClick={() => this.onHideLayer(layer.dataset)} aria-label="Toggle the visibility">
            <Icon name={this.isLayerVisible(layer) ? 'icon-hide' : 'icon-show'} />
          </button>
        ) }
        <button className="info" onClick={() => this.onLayerInfoModal(layer)} aria-label="More information">
          <Icon name="icon-info" />
        </button>
        { !this.props.readonly
          && <button className="close" onClick={() => this.onDeactivateLayer(layer.dataset)} aria-label="Remove">
            <Icon name="icon-cross" />
          </button>
        }
      </div>
    );
  }

  getLegendItems() {
    // Reverse layers to show first the last one added
    const layersActiveReversed = this.props.layersActive.slice().reverse();
    return layersActiveReversed.map(layer => (
      <li key={layer.slug} className="c-legend-unit">
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

  /**
   * Return whether the layer is hidden or not
   * @param {object} layer
   * @returns {boolean}
   */
  isLayerVisible(layer) {
    return !this.props.layersHidden.includes(layer.dataset);
  }

  render() {
    return (
      <div className="c-legend-map">
        <div className={`open-legend ${this.state.open ? '-active' : ''}`}>
          <button className="toggle-legend" onClick={() => this.setState({ open: false })}>
            <Icon name="icon-arrow-down" className="-small" />
          </button>
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
  // Layers can't be removed or hidden
  readonly: React.PropTypes.bool,
  // Whether by default the legend is expanded or not
  expanded: React.PropTypes.bool,

  // Functions
  toggleDatasetActive: React.PropTypes.func,
  setDatasetsActive: React.PropTypes.func,
  toggleModal: React.PropTypes.func,
  setModalOptions: React.PropTypes.func,
  setDatasetsHidden: React.PropTypes.func
};

Legend.defaultProps = {
  readonly: false,
  expanded: true
};

export default Legend;

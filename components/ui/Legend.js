import React from 'react';
import PropTypes from 'prop-types';
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
  }

  /**
   * Event handler executed when the user drops the layer group
   * they were dragging
   * @param {any} { oldIndex, newIndex }
   */
  onSortEnd({ oldIndex, newIndex }) {
    const layers = [...this.props.layerGroups];
    const datasets = arrayMove(layers, oldIndex, newIndex)
      .map(l => l.dataset);
    this.props.setLayerGroupsOrder(datasets);
  }

  /**
   * Event handler executed when the user clicks the button
   * to toggle the visibility of a layer
   * @param {object} layer
   */
  onToggleLayerGroupVisibility(layerGroup) {
    this.props.toggleLayerGroupVisibility(layerGroup);
  }

  /**
   * Event handler executed when the user clicks the button
   * to remove a layer group from the map
   * @param {LayerGroup} layerGroup
   */
  onRemoveLayerGroup(layerGroup) {
    this.props.removeLayerGroup(layerGroup);
  }

  /**
   * Event handler executed when the user clicks the info
   * button of a layer group
   * @param {LayerGroup} layerGroup
   */
  onLayerInfoModal(layerGroup) {
    const activeLayer = layerGroup.layers.find(l => l.active);
    this.props.toggleModal(true, {
      children: LayerInfoModal,
      childrenProps: {
        data: activeLayer
      }
    });
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

  /**
   * Return the action buttons associated to a
   * layer group
   * @param {LayerGroup} layerGroup
   * @returns {HTMLElement}
   */
  getItemsActions(layerGroup) {
    return (
      <div className="item-actions">
        <button className="layers" onClick={() => this.onClickLayers()} aria-label="Select other layer">
          <Icon name="icon-layers" />
        </button>
        { // eslint-disable-next-line max-len
        /* <button className="opacity" onClick={() => this.onClickOpacity()} aria-label="Change opacity">
             <Icon name="icon-opacity" />
           </button>
        */
        }
        { !this.props.readonly && (
          <button
            className="toggle"
            onClick={() => this.onToggleLayerGroupVisibility(layerGroup)}
            aria-label="Toggle the visibility"
          >
            <Icon name={layerGroup.visible ? 'icon-hide' : 'icon-show'} />
          </button>
        ) }
        <button className="info" onClick={() => this.onLayerInfoModal(layerGroup)} aria-label="More information">
          <Icon name="icon-info" />
        </button>
        { !this.props.readonly
          && <button className="close" onClick={() => this.onRemoveLayerGroup(layerGroup)} aria-label="Remove">
            <Icon name="icon-cross" />
          </button>
        }
      </div>
    );
  }

  /**
   * Return the list of layers
   * @returns {HTMLElement[]}
   */
  getLegendItems() {
    return this.props.layerGroups.map((layerGroup) => {
      const activeLayer = layerGroup.layers.find(l => l.active);
      return (
        <li key={layerGroup.dataset} className="c-legend-unit">
          <div className="legend-info">
            <header className="legend-item-header">
              <h3 className={this.props.className.color}>
                <span className="name">{activeLayer.name}</span>
              </h3>
              {this.getItemsActions(layerGroup)}
            </header>
            <LegendType config={activeLayer.legendConfig} className={this.props.className} />
          </div>
          <DragHandle />
        </li>
      );
    });
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
  className: PropTypes.object,
  // List of LayerGroup items
  layerGroups: PropTypes.array,
  // Layers can't be removed or hidden
  readonly: PropTypes.bool,
  // Whether by default the legend is expanded or not
  expanded: PropTypes.bool,

  // Functions

  // Toggle the modal
  toggleModal: PropTypes.func,
  // Callback to hide/show a layer group
  toggleLayerGroupVisibility: PropTypes.func,
  // Callback to re-order the layer groups
  setLayerGroupsOrder: PropTypes.func.isRequired,
  // Callback to remove a layer group
  removeLayerGroup: PropTypes.func
};

Legend.defaultProps = {
  readonly: false,
  expanded: true
};

export default Legend;

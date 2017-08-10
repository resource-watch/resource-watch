import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal } from 'redactions/modal';
import { toggleTooltip, setTooltipPosition } from 'redactions/tooltip';

// Components
import LegendType from 'components/ui/LegendType';
import Icon from 'components/ui/Icon';
import LayerInfoModal from 'components/modal/LayerInfoModal';
import LayersTooltip from 'components/app/explore/LayersTooltip';
import Button from 'components/ui/Button';

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

  /**
   * Return the position of a DOM element
   * @static
   * @param {HTMLElement} node
   * @returns {{ x: number, y: number }}
   */
  static getElementPosition(node) {
    const clientRect = node.getBoundingClientRect();
    return {
      x: window.scrollX + clientRect.left + (clientRect.width / 2),
      y: window.scrollY + clientRect.top + (clientRect.height / 2)
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      open: props.expanded,
      layersTooltipOpen: false,
      layersTourTooltipOpen: false,
      // Show a "tour" tooltip if the user adds a multi-layer
      // layer group for the first time
      hasShownLayersTourTooltip: false
    };

    // List of the layers buttons
    this.layersButtons = [];

    // BINDINGS
    this.onSortEnd = this.onSortEnd.bind(this);
    this.onScrollLegend = throttle(this.onScrollLegend.bind(this), 30);
  }

  componentDidMount() {
    // Show the layers tour tooltip
    if (!this.state.hasShownLayersTourTooltip && this.state.open) {
      this.showLayersTourTooltip();
    }
  }

  componentDidUpdate(previousProps, previousState) {
    const haveLayerGroupsChanged = !isEqual(this.props.layerGroups, previousProps.layerGroups);
    // If the layers tooltip is opened and the layer groups changed in
    // some way, then the height of the legend might change and we need
    // to reposition the tooltip
    if (this.state.layersTooltipOpen
      && this.activeLayersButton
      && haveLayerGroupsChanged) {
      this.props.setTooltipPosition(Legend.getElementPosition(this.activeLayersButton));
    }

    // Show the layers tour tooltip
    if ((haveLayerGroupsChanged || this.state.open !== previousState.open)
      && !this.state.hasShownLayersTourTooltip) {
      if (this.state.open) this.showLayersTourTooltip();
    }
  }

  /**
   * Event handler executed when the user starts dragging
   * a layer group
   */
  onSortStart() {
    // If the layers tour tooltip is opened, then we close it
    if (this.state.layersTourTooltipOpen) {
      this.closeLayersTourTooltip();
    }
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
   * @param {MouseEvent} e
   * @param {LayerGroup} layerGroup
   */
  onClickLayers(e, layerGroup) {
    this.setState({ layersTooltipOpen: true });

    // If the user is opening the tooltip to select a layer
    // then the tour doesn't make any sense anymore
    this.closeLayersTourTooltip();

    // We save the button that was used to open the tooltip
    // so we can compute its position later
    this.activeLayersButton = e.target;

    this.props.toggleTooltip(true, {
      follow: false,
      position: Legend.getElementPosition(this.activeLayersButton),
      children: LayersTooltip,
      childrenProps: {
        layerGroup,
        onChangeLayer: this.props.setLayerGroupActiveLayer,
        onClose: () => {
          this.setState({ layersTooltipOpen: false });
          this.props.toggleTooltip(false);
        }
      }
    });
  }

  /**
   * Event handler executed when the user scrolls in the legend
   */
  onScrollLegend() {
    // If the user scrolls in the legend, we close the tooltip
    // to avoid having it pointing to anything that is not the
    // layers button
    if (!this.state.hasShownLayersTourTooltip && this.state.layersTourTooltipOpen) {
      this.closeLayersTourTooltip();
    }

    // The same happens with the layers tooltip
    if (this.state.layersTooltipOpen) {
      this.props.toggleTooltip(false);
      this.setState({ layersTooltipOpen: false });
    }
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
        { layerGroup.layers.length > 1 && (
          <button
            className="layers"
            onClick={e => this.onClickLayers(e, layerGroup)}
            aria-label="Select other layer"
            ref={(node) => { if (node) this.layersButtons.push(node); }}
          >
            <Icon name="icon-layers" />
          </button>
        ) }
        { // eslint-disable-next-line max-len
        /* <button className="opacity" onClick={() => this.onClickOpacity()} aria-label="Change opacity">
             <Icon name="icon-opacity" />
           </button>
        */
        }
        <button
          className="toggle"
          onClick={() => this.onToggleLayerGroupVisibility(layerGroup)}
          aria-label="Toggle the visibility"
        >
          <Icon name={layerGroup.visible ? 'icon-hide' : 'icon-show'} />
        </button>
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
    // We reset the buttons each time we render the legend again
    this.layersButtons = [];

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

  /**
   * Show the layers tour tooltip on the first layer group
   * that has several layers
   */
  showLayersTourTooltip() {
    const multiLayerLayerGroupIndex = this.props.layerGroups.findIndex(l => l.layers.length > 1);

    if (multiLayerLayerGroupIndex === -1) {
      // If there's no multi-layer layer group and the tooltip
      // is shown, we remove it
      if (this.state.layersTourTooltipOpen) this.closeLayersTourTooltip();
      return;
    }

    const button = this.layersButtons[multiLayerLayerGroupIndex];
    if (!button) return;

    this.setState({ layersTourTooltipOpen: true });

    this.props.toggleTooltip(true, {
      follow: false,
      position: Legend.getElementPosition(this.layersButtons[multiLayerLayerGroupIndex]),
      children: props => (
        <div>
          This dataset has {props.layersCount} layers
          <div style={{ textAlign: 'center', marginTop: '5px' }}>
            <Button
              properties={{ className: '-tertiary' }}
              onClick={() => this.closeLayersTourTooltip()}
            >
              Ok
            </Button>
          </div>
        </div>
      ),
      childrenProps: {
        layersCount: this.props.layerGroups.find(l => l.layers.length > 1).layers.length
      }
    });
  }

  /**
   * Hide the layers tour tooltip
   */
  closeLayersTourTooltip() {
    this.setState({
      layersTourTooltipOpen: false,
      hasShownLayersTourTooltip: true
    });
    this.props.toggleTooltip(false);
  }

  render() {
    // We reset the list of button each time we render
    // the component again
    this.layersButtons = [];

    return (
      <div className="c-legend-map">
        <div className={`open-legend ${this.state.open ? '-active' : ''}`} onScroll={this.onScrollLegend}>
          <button className="toggle-legend" onClick={() => this.setState({ open: false })}>
            <Icon name="icon-arrow-down" className="-small" />
          </button>
          <SortableList
            items={this.getLegendItems()}
            helperClass="c-legend-unit -sort"
            onSortStart={() => this.onSortStart()}
            onSortEnd={this.onSortEnd}
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

  // Callback to hide/show a layer group
  toggleLayerGroupVisibility: PropTypes.func.isRequired,
  // Callback to re-order the layer groups
  setLayerGroupsOrder: PropTypes.func.isRequired,
  // Callback to remove a layer group
  removeLayerGroup: PropTypes.func,
  // Callback to change which layer of the layer group is active
  setLayerGroupActiveLayer: PropTypes.func.isRequired,

  // Redux

  // Toggle the modal
  toggleModal: PropTypes.func.isRequired,
  // Toggle the tooltip
  toggleTooltip: PropTypes.func.isRequired,
  // Set the position of the tooltip
  setTooltipPosition: PropTypes.func.isRequired
};

Legend.defaultProps = {
  readonly: false,
  expanded: true
};

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  toggleModal: (open, options) => dispatch(toggleModal(open, options)),
  toggleTooltip: (open, options) => dispatch(toggleTooltip(open, options)),
  setTooltipPosition: pos => dispatch(setTooltipPosition(pos))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Legend);

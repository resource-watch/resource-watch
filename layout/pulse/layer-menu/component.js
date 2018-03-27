import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Redux
import { connect } from 'react-redux';

// Components
import LayerMenuDropdown from 'layout/pulse/layer-menu-dropdown';

class LayerMenuComponent extends PureComponent {
  handleLayerClick(layer) {
    const {
      id, markerType, basemap, contextLayers, descriptionPulse, contextLayersOnTop
    } = layer;
    this.props.resetLayerPoints();
    this.props.toggleActiveLayer({
      id,
      threedimensional: layer['3d'],
      markerType,
      basemap,
      contextLayers,
      descriptionPulse,
      contextLayersOnTop
    });
    logEvent('Planet Pulse', 'Choose layer to view', layer.label);
  }

  createItemGroup(group) {
    const { layerActive } = this.props;
    const activeGroup = layerActive && layerActive.group === group.label ? '-active' : '';
    return (
      <li key={`item-group-${group.label}`} className={activeGroup}>
        <span className="name">
          {group.label}
        </span>
        <LayerMenuDropdown
          layers={group.layers}
          triggerClick={layer => this.handleLayerClick(layer)}
        />
      </li>
    );
  }

  render() {
    const { layersGroup } = this.props;
    return (
      <div className="c-layer-menu">
        <div className="l-container">
          <ul className="layer-menu-list">
            {layersGroup.length > 0 && layersGroup[0].layers.map(g => this.createItemGroup(g))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

LayerMenuComponent.propTypes = {
  layersGroup: PropTypes.array,
  layerActive: PropTypes.any,
  toggleActiveLayer: PropTypes.func.isRequired,
  resetLayerPoints: PropTypes.func.isRequired
};

export default connect(mapStateToProps, null)(LayerMenuComponent);

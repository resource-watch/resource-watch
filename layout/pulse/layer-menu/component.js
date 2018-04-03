import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Redux
import { connect } from 'react-redux';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Components
import LayerMenuDropdown from 'layout/pulse/layer-menu-dropdown';
import LayerMenuNative from 'layout/pulse/layer-menu-native';

class LayerMenuComponent extends PureComponent {
  handleLayerClick(layer) {
    const {
      id, markerType, basemap, contextLayers, descriptionPulse, contextLayersOnTop, label
    } = layer;
    this.props.resetLayerPoints();
    this.props.toggleActiveLayer({
      id,
      threedimensional: layer['3d'],
      markerType,
      basemap,
      contextLayers,
      descriptionPulse,
      contextLayersOnTop,
      label
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
    const { layersGroup, responsive } = this.props;
    if (layersGroup.length > 0) {
      return (
        <div>
          <MediaQuery
            maxDeviceWidth={breakpoints.medium - 1}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <LayerMenuNative
              layers={layersGroup[0].layers}
              triggerClick={layer => this.handleLayerClick(layer)}
            />
          </MediaQuery>
          <MediaQuery
            minDeviceWidth={breakpoints.medium}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <div className="c-layer-menu">
              <div className="l-container">
                <ul className="layer-menu-list">
                  {layersGroup[0].layers.map(g => this.createItemGroup(g))}
                </ul>
              </div>
            </div>
          </MediaQuery>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

LayerMenuComponent.propTypes = {
  layersGroup: PropTypes.array,
  layerActive: PropTypes.any,
  responsive: PropTypes.object,
  toggleActiveLayer: PropTypes.func.isRequired,
  resetLayerPoints: PropTypes.func.isRequired
};

export default connect(mapStateToProps, null)(LayerMenuComponent);

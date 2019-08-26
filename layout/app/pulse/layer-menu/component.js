import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Utils
import { logEvent } from 'utils/analytics';

// Redux
import { connect } from 'react-redux';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Components
import LayerMenuDropdown from 'layout/app/pulse/layer-menu-dropdown';
import LayerMenuNative from 'layout/app/pulse/layer-menu-native';

// styles
import './styles.scss';

class LayerMenuComponent extends PureComponent {
  handleLayerClick(layer) {
    const {
      id,
      markerType,
      basemap,
      contextLayers,
      descriptionPulse,
      contextLayersOnTop,
      label,
      rotatableGlobe,
      initialPosition
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
      label,
      rotatableGlobe,
      initialPosition
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
                <div className="description-box">
                  <h2>Planet Pulse</h2>
                  <p>ABOUT</p>
                  <p>
                    Track natural disasters, monitor the changing environment, and observe human
                     events with this selection of Resource Watch&apos;s most timely data.
                     All data visualized on the globe are frequently updated by the data provider,
                     from multiple times a day to monthly. Subscribe to alerts to get updates
                     on world events as they unfold.
                  </p>
                  <p>
                    See these and more near real-time data on <Link to="explore" params={{ frequencies: 'near_real_time' }}><a>Explore</a></Link>
                  </p>
                </div>
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

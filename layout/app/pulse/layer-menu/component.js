import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// components
import LayerMenuDropdown from 'layout/app/pulse/layer-menu-dropdown';
import LayerMenuNative from 'layout/app/pulse/layer-menu-native';

// utils
import { logEvent } from 'utils/analytics';

// lib
import {
  Media,
} from 'lib/media';

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
      initialPosition,
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
      initialPosition,
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
          triggerClick={(layer) => this.handleLayerClick(layer)}
        />
      </li>
    );
  }

  render() {
    const { layersGroup } = this.props;
    if (layersGroup.length > 0) {
      return (
        <>
          <Media
            at="sm"
          >
            <LayerMenuNative
              layers={layersGroup[0].layers}
              triggerClick={(layer) => this.handleLayerClick(layer)}
            />
          </Media>
          <Media
            greaterThanOrEqual="md"
          >
            <div className="c-layer-menu">
              <div className="l-container">
                <ul className="layer-menu-list">
                  {layersGroup[0].layers.map((g) => this.createItemGroup(g))}
                </ul>
              </div>
            </div>
          </Media>
        </>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({ layerActive: state.pulse.layerActive });

LayerMenuComponent.propTypes = {
  layersGroup: PropTypes.array,
  layerActive: PropTypes.any,
  toggleActiveLayer: PropTypes.func.isRequired,
  resetLayerPoints: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, null)(LayerMenuComponent);

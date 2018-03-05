import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Redux
import { connect } from 'react-redux';

// Components
import Switch from 'components/ui/Switch';

class LayerMenuDropdownComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.triggerClick = this.triggerClick.bind(this);
  }

  triggerClick(layer) {
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
  render() {
    const { layerActive, layers } = this.props;
    return (
      <div className="c-layer-menu-dropdown dropdown">
        <ul>
          {layers.map(layer =>
            (
              <li
                key={layer.id}
                onClick={() => this.triggerClick(layer)}
              >
                <Switch active={(layerActive && (layerActive.id === layer.id))} />
                <span className="name">
                  {layer.label}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

LayerMenuDropdownComponent.propTypes = {
  layers: PropTypes.array,
  layerActive: PropTypes.object,
  toggleActiveLayer: PropTypes.func.isRequired,
  resetLayerPoints: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  layerActive: state.layerMenuPulse.layerActive
});


export default connect(mapStateToProps, null)(LayerMenuDropdownComponent);

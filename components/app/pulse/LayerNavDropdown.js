import React from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Redux
import { toggleActiveLayer, resetLayerPoints } from 'redactions/pulse';
import { connect } from 'react-redux';

// Components
import Switch from 'components/ui/Switch';

class LayerNavDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.triggerClick = this.triggerClick.bind(this);
  }

  triggerClick(layer) {
    const { id, markerType, basemap, contextLayers } = layer;
    this.props.resetLayerPoints();
    this.props.toggleActiveLayer(id, layer['3d'], markerType, basemap, contextLayers);
    logEvent('Planet Pulse', 'Choose layer to view', layer.label);
  }

  render() {
    const { layerActive, layers } = this.props;
    return (
      <div className="c-layer-nav-dropdown dropdown">
        <ul>
          {layers.map(layer =>
            (<li
              key={layer.id}
              onClick={() => this.triggerClick(layer)}
            >
              <Switch active={(layerActive && (layerActive.id === layer.id))} />
              <span className="name">
                {layer.label}
              </span>
            </li>)
          )}
        </ul>
      </div>
    );
  }
}

LayerNavDropdown.propTypes = {
  layers: PropTypes.array,
  layerActive: PropTypes.object,
  toggleActiveLayer: PropTypes.func.isRequired,
  resetLayerPoints: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

const mapDispatchToProps = {
  toggleActiveLayer,
  resetLayerPoints
};

export default connect(mapStateToProps, mapDispatchToProps)(LayerNavDropdown);

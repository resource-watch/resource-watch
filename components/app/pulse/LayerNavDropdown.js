import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'components/ui/Switch';
import { connect } from 'react-redux';

import { toggleActiveLayer, getLayerPoints } from 'redactions/pulse';

class LayerNavDropdown extends React.Component {

  constructor(props) {
    super(props);

    this.triggerClick = this.triggerClick.bind(this);
  }

  triggerClick(e) {
    const { id, threedimensional, markertype } = e.currentTarget.dataset;
    this.props.toggleActiveLayer(id, threedimensional, markertype);
  }

  render() {
    const { layerActive, layers } = this.props;
    return (
      <div className="c-layer-nav-dropdown dropdown">
        <ul>
          {layers.map(layer =>
              (<li
                data-id={layer.id}
                data-threedimensional={layer['3d']}
                data-markertype={layer.markerType}
                key={layer.id}
                onClick={this.triggerClick}
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
  toggleActiveLayer: PropTypes.func
};

const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

const mapDispatchToProps = dispatch => ({
  toggleActiveLayer: (id, threedimensional, hemisphere) => {
    dispatch(toggleActiveLayer(id, threedimensional, hemisphere));
  },
  getLayerPoints: (id, tableName) => {
    dispatch(getLayerPoints(id, tableName));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerNavDropdown);

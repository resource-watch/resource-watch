import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import LayerNavDropdown from 'components/app/pulse/LayerNavDropdown';

class LayerMenuDropdownComponent extends PureComponent {
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

export default connect(mapStateToProps, null)(LayerMenuDropdownComponent);

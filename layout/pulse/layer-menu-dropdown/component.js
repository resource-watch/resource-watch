import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Redux
import { connect } from 'react-redux';

// Components
import Switch from 'components/ui/Switch';

class LayerMenuDropdownComponent extends PureComponent {
  render() {
    const { layerActive, layers, triggerClick } = this.props;
    return (
      <div className="c-layer-menu-dropdown dropdown">
        <ul>
          {layers.map(layer =>
            (
              <li
                key={layer.id}
                onClick={() => triggerClick(layer)}
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
  triggerClick: PropTypes.func,
  layerActive: PropTypes.object
};

const mapStateToProps = state => ({
  layerActive: state.layerMenuPulse.layerActive
});


export default connect(mapStateToProps, null)(LayerMenuDropdownComponent);

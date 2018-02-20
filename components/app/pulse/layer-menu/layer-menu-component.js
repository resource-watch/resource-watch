import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import LayerNavDropdown from 'components/app/pulse/LayerNavDropdown';

class LayerMenuComponent extends PureComponent {
  createItemGroup(group) {
    const { layerActive } = this.props;
    const activeGroup = layerActive && layerActive.group === group.label ? '-active' : '';
    return (
      <li key={`item-group-${group.label}`} className={activeGroup}>
        <span className="name">
          {group.label}
        </span>
        <LayerNavDropdown layers={group.layers} />
      </li>
    );
  }

  render() {
    const { layersGroup } = this.props;
    return (
      <div className="c-layer-nav">
        <div className="l-container">
          <ul className="layer-nav-list">
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
  layerActive: PropTypes.any
};

export default connect(mapStateToProps, null)(LayerMenuComponent);

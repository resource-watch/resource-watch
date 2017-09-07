import React from 'react';
import PropTypes from 'prop-types';
import LayerNavDropdown from 'components/app/pulse/LayerNavDropdown';

const LayerNav = ({ layerActive, layersGroup }) => {
  function createItemGroup(group) {
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
  return (
    <div className="c-layer-nav">
      <div className="l-container">
        <ul className="layer-nav-list">
          {layersGroup.length > 0 && layersGroup[0].layers.map(createItemGroup)}
        </ul>
      </div>
    </div>
  );
};

LayerNav.propTypes = {
  layersGroup: PropTypes.array,
  layerActive: PropTypes.any
};

LayerNav.defaultProps = {
  layersGroup: [],
  layerActive: null
};

export default LayerNav;

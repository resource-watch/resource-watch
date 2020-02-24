import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Styles
import './styles.scss';

function DatasetLayerCard(props) {
  const {
    dataset,
    layer: { id, name, description },
    layerGroups,
    setMapLayerGroupActive,
    toggleMapLayerGroup
  } = props;

  const layerGroup = layerGroups.find(lg => lg.dataset === dataset.id);
  const layerFromRedux = layerGroup && layerGroup.layers
    && layerGroup.layers.find(l => l.id === id);
  const layerIsActive = layerFromRedux && layerFromRedux.active;
  const layerButtonClassname = classnames({
    'c-button': true,
    '-secondary': !layerIsActive,
    '-primary': layerIsActive,
    '-fullwidth': true
  });

  return (
    <div className="c-dataset-layer-card">
      <div className="layer-data">
        <strong>{name}</strong>
        <p>{description}</p>
      </div>
      <div className="button-container">
        <button
          className={layerButtonClassname}
          onClick={() => {
            if (!layerIsActive) {
              if (!layerGroup) {
                toggleMapLayerGroup({ dataset, toggle: true });
              }
              setMapLayerGroupActive({ dataset: { id: dataset.id }, active: id });
            } else {
              toggleMapLayerGroup({ dataset: { id: dataset.id }, toggle: false });
            }
          }}
        >
          {!layerIsActive && <span>Show layer</span>}
          {layerIsActive && <span>Active</span>}
        </button>
      </div>
    </div>
  );
}

DatasetLayerCard.propTypes = {
  dataset: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  layerGroups: PropTypes.array.isRequired,
  setMapLayerGroupActive: PropTypes.func.isRequired,
  toggleMapLayerGroup: PropTypes.func.isRequired
};

export default DatasetLayerCard;

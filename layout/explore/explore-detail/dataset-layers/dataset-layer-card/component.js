import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Utils
import { logEvent } from 'utils/analytics';

// Styles
import './styles.scss';

function DatasetLayerCard(props) {
  const {
    dataset,
    layer: { id, name, description },
    layerGroup,
    layerIsActive,
    setMapLayerGroupActive,
    toggleMapLayerGroup
  } = props;

  const componentClassname = classnames({
    'c-dataset-layer-card': true,
    '-active': layerIsActive
  });
  const layerButtonClassname = classnames({
    'c-button': true,
    '-secondary': !layerIsActive,
    '-primary': layerIsActive,
    '-fullwidth': true
  });

  return (
    <div className={componentClassname}>
      <div className="layer-data">
        <strong>{name}</strong>
        <p className="description">{description}</p>
      </div>
      <div className="button-container">
        <button
          className={layerButtonClassname}
          onClick={() => {
            if (!layerIsActive) {
              logEvent('Explore (Detail)', 'Show Layer', `${name} [${id}]`);
              if (!layerGroup) {
                toggleMapLayerGroup({ dataset, toggle: true });
              }
              setMapLayerGroupActive({ dataset: { id: dataset.id }, active: id });
            } else {
              toggleMapLayerGroup({ dataset: { id: dataset.id }, toggle: false });
              logEvent('Explore (Detail)', 'Hide Layer', `${name} [${id}]`);
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
  layerGroup: PropTypes.object.isRequired,
  layerIsActive: PropTypes.bool.isRequired,
  setMapLayerGroupActive: PropTypes.func.isRequired,
  toggleMapLayerGroup: PropTypes.func.isRequired
};

export default DatasetLayerCard;

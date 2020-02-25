import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetLayerCard from './dataset-layer-card';

// Styles
import './styles.scss';

function DatasetLayers(props) {
  const { layers, dataset } = props;
  return (
    <div className="c-dataset-layers">
      <h3>Dataset layers</h3>
      <div className="layers-container" >
        {layers.map(layer => (
          <DatasetLayerCard layer={layer} dataset={dataset} />
        ))}
      </div>
    </div>
  );
}

DatasetLayers.propTypes = {
  layers: PropTypes.array.isRequired,
  dataset: PropTypes.object.isRequired
};

export default DatasetLayers;

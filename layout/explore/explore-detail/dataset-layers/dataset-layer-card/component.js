import React from 'react';
import PropTypes from 'prop-types';

// Styles
import './styles.scss';

function DatasetLayerCard(props) {
  const { layer } = props;
  return (
    <div className="c-dataset-layer-card" />
  );
}

DatasetLayerCard.propTypes = { layer: PropTypes.object.isRequired };

export default DatasetLayerCard;

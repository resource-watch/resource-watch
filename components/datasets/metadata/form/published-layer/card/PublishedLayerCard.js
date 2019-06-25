import React from 'react';
import PropTypes from 'prop-types';

// styles
import './styles.scss';

function PublishedLayerCard({ layer, onDragStart, onDragEnd, index }) {
  return (
    <div
      draggable
      className="c-published-layer-card"
      onDragStart={e => onDragStart(e, index)}
      onDragEnd={onDragEnd}
    >
      <h5>{layer.name}</h5>
    </div>
  );
}

PublishedLayerCard.propTypes = {
  layer: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired
};

export default PublishedLayerCard;

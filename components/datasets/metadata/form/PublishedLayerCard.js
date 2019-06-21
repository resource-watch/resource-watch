import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { ITEM_TYPES } from './constants';

function PublishedLayerCard({ id, layer, moveLayer, findLayer }) {
  const originalIndex = findLayer(id).index;
  const [{ isDragging }, drag] = useDrag({
    item: { type: ITEM_TYPES.PUBLISHED_LAYER, id, originalIndex },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });
  const [, drop] = useDrop({
    accept: ITEM_TYPES.PUBLISHED_LAYER,
    canDrop: () => false,
    hover({ id: draggedId }) {
      if (draggedId !== id) {
        const { index: overIndex } = findLayer(id);
        moveLayer(draggedId, overIndex);
      }
    }
  });

  return (
    <div ref={drag(drop(node))}>
      <h5>{layer.name}</h5>
      <p>{layer.description}</p>
    </div>
  );
}

PublishedLayerCard.propTypes = {
  layer: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  moveLayer: PropTypes.func.isRequired,
  findLayer: PropTypes.func.isRequired
};

export default PublishedLayerCard;

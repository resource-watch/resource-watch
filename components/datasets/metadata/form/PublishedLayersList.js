import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { ITEM_TYPES } from './constants';

// Components
import PublishedLayerCard from './PublishedLayerCard';

function PublishedLayersList(props) {
  const [layers, setLayers] = useState(props.layers);
  const findLayer = (id) => {
    const layer = layers.filter(c => `${c.id}` === id)[0];
    return {
      layer,
      index: layers.indexOf(layer)
    };
  };
  const moveLayer = (id, atIndex) => {
    const { layer, index } = findLayer(id);
    setLayers(
      update(layers, { $splice: [[index, 1], [atIndex, 0, layer]] })
    );
  };
  const [, drop] = useDrop({ accept: ITEM_TYPES.PUBLISHED_LAYER });

  return (
    <div ref={drop}>
      {layers.map(layer => (
        <PublishedLayerCard
          key={layer.id}
          id={layer.id}
          layer={layer}
          moveLayer={moveLayer}
          findLayer={findLayer}
        />
      ))}
    </div>
  );
}

PublishedLayersList.propTypes = { layers: PropTypes.array.isRequired };

export default PublishedLayersList;

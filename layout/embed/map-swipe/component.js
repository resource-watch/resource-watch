import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import CompareMaps from 'components/map/plugins/compare';
import Spinner from 'components/ui/Spinner';

// services
import { fetchLayer } from 'services/layer';

const LayoutEmbedMapSwipe = (props) => {
  const { layerIds, bbox } = props;
  const [loading, setLoading] = useState(true);
  const [layers, setlayers] = useState([]);

  useEffect(() => {
    if (layerIds && layerIds.length === 2) {
      const promises = layerIds.map(_layerId => fetchLayer(_layerId));

      axios.all(promises)
        .then(axios.spread((leftLayer, rightLayer) => {
          setlayers([leftLayer, rightLayer]);
        }))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [layerIds]);

  return (
    <LayoutEmbed
      title="Map comparison"
      description=""
    >
      {loading && (
        <Spinner
          isLoading={loading}
          className="-light"
        />)}

      {!loading && (<CompareMaps layers={layers} bbox={bbox} />)}
    </LayoutEmbed>
  );
};

LayoutEmbedMapSwipe.propTypes = { layerIds: PropTypes.array };

LayoutEmbedMapSwipe.defaultProps = { layerIds: [] };

export default LayoutEmbedMapSwipe;

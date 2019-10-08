import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import axios from 'axios';

// Components
import LayoutEmbed from 'layout/layout/layout-embed';
import MapComparison from 'components/map/plugins/compare';
import Spinner from 'components/ui/Spinner';

// services
import { fetchLayer } from 'services/layer';

const LayoutEmbedMapSwipe = (props) => {
  const {
    layerIds,
    isLoadedExternally
  } = props;
  const [loading, setLoading] = useState(true);
  const [layers, setlayers] = useState([]);

  useEffect(() => {
    if (layerIds && layerIds.length === 2) {
      const promises = layerIds.map(_layerId => fetchLayer(_layerId));

      axios.all(promises)
        .then(axios.spread((leftLayer, rightLayer) => {
          setlayers([leftLayer, rightLayer]);

          setLoading(false);
        }));
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

      {!loading && (
        <div className="c-embed-widget -map">
          <div
            className={classnames({
              'widget-content': true,
              '-external': isLoadedExternally
            })}
          >
            <MapComparison
              layers={layers}
              mapOptions={{}}
            />
          </div>
        </div>)}
    </LayoutEmbed>
  );
};

LayoutEmbedMapSwipe.propTypes = { layerIds: PropTypes.array };

LayoutEmbedMapSwipe.defaultProps = { layerIds: [] };

export default LayoutEmbedMapSwipe;

import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import isNumber from 'lodash/isNumber';

// services
import { fetchLayer } from 'services/layer';

// constants
import { DEFAULT_VIEWPORT } from 'components/map/constants';

// components
import MapSwipe from './component';

const MapSwipeContainer = () => {
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState([]);
  const {
    query: {
      layers: layerIdsParams,
      bbox: bboxParams,
      zoom,
      lat: latitude,
      lng: longitude,
    },
  } = useRouter();
  const layerIds = useMemo(() => (layerIdsParams ? layerIdsParams.split(',') : []), [layerIdsParams]);
  let bbox = null;

  try {
    if (bboxParams) bbox = JSON.parse(bboxParams);
  } catch (e) {
    throw new Error('There was an issue parsing bbox: ', e.message);
  }

  const viewport = {
    ...DEFAULT_VIEWPORT,
    ...(zoom && isNumber(+zoom) && !Number.isNaN(+zoom)) && { zoom: +zoom },
    ...(latitude && isNumber(+latitude) && !Number.isNaN(+latitude)) && { latitude: +latitude },
    ...(longitude
        && isNumber(+longitude)
        && !Number.isNaN(+longitude)
    ) && {
      longitude: +longitude,
    },
  };

  useEffect(() => {
    if (layerIds && layerIds.length === 2) {
      const promises = layerIds.map((_layerId) => fetchLayer(_layerId));

      axios.all(promises)
        .then(axios.spread((leftLayer, rightLayer) => {
          setLayers([leftLayer, rightLayer]);
        }))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [layerIds]);

  return (
    <MapSwipe
      isFetching={loading}
      layers={layers}
      mapOptions={{
        viewport,
      }}
      bbox={bbox}
    />
  );
};

export default MapSwipeContainer;

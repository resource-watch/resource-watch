import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import LayerManager from 'components/map/layer-manager';
import type { ViewState } from 'react-map-gl';
import omit from 'lodash/omit';

import { APILayerSpec, layerConfigSpec } from 'types/layer';
import { Basemap } from 'components/map/types';
import { MAPSTYLES } from '../constants';

export interface MapThumbnailProps {
  layer: APILayerSpec;
  basemap?: Basemap;
  viewState?: ViewState;
}

export const MapThumbnail = ({
  layer,
  basemap = 'dark',
  viewState = { zoom: 0, latitude: 15, longitude: -35 },
}: MapThumbnailProps): JSX.Element => {
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const mapRef = useRef(null);
  const handleMapLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleBasemap = useCallback(
    (basemap: Basemap) => {
      const { current: map } = mapRef;
      const BASEMAP_GROUPS = ['basemap'];
      const { layers, metadata } = map.getStyle();

      const basemapGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
        const { name } = metadata['mapbox:groups'][k];

        const matchedGroups = BASEMAP_GROUPS.map((rgr) => name.toLowerCase().includes(rgr));

        return matchedGroups.some((bool) => bool);
      });

      const basemapsWithMeta = basemapGroups.map((groupId) => ({
        ...metadata['mapbox:groups'][groupId],
        id: groupId,
      }));
      const basemapToDisplay = basemapsWithMeta.find((_basemap) => _basemap.name.includes(basemap));

      const basemapLayers = layers.filter((l) => {
        const { metadata: layerMetadata } = l;
        if (!layerMetadata) return false;

        const gr = layerMetadata['mapbox:group'];
        return basemapGroups.includes(gr);
      });

      basemapLayers.forEach((_layer) => {
        mapRef.current.setLayoutProperty(
          _layer.id,
          'visibility',
          _layer.metadata['mapbox:group'] === basemapToDisplay.id ? 'visible' : 'none',
        );
      });
    },
    [mapRef],
  );

  useEffect(() => {
    if (isLoaded) handleBasemap(basemap);
  }, [basemap, isLoaded, handleBasemap]);

  const parsedLayer = useMemo(
    () => [
      {
        ...layer,
        layerConfig: {
          ...layer.layerConfig,
          // for previewing the layer, we remove any zoom properties as we always
          // use zoom 0 for render the thumbnails
          source: omit(layer.layerConfig.source, ['maxzoom', 'minzoom']),
        } as layerConfigSpec,
      },
    ],
    [layer],
  );

  return (
    <StaticMap
      ref={(_map) => {
        if (_map) mapRef.current = _map.getMap();
      }}
      mapboxApiAccessToken={
        process.env.NEXT_PUBLIC_RW_MAPBOX_API_TOKEN || process.env.STORYBOOK_RW_MAPBOX_API_TOKEN
      }
      width="100%"
      height="100%"
      viewState={viewState}
      mapStyle={MAPSTYLES}
      className="mapbox-thumbnail"
      onLoad={handleMapLoad}
      attributionControl={false}
      reuseMaps
    >
      {isLoaded && <LayerManager map={mapRef.current} layers={parsedLayer} />}
    </StaticMap>
  );
};

export default MapThumbnail;

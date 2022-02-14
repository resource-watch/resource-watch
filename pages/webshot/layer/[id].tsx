import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Map } from 'react-map-gl';
import LayerManager from 'components/map/layer-manager';
import type { ViewState } from 'react-map-gl';
import omit from 'lodash/omit';

import { APILayerSpec, layerConfigSpec } from 'types/layer';
import { Basemap } from 'components/map/types';
import { MAPSTYLES } from 'components/map/constants';

import { fetchLayer } from 'services/layer';

export interface MapThumbnailProps {
  layer: APILayerSpec;
  basemap?: Basemap;
  viewState?: Partial<ViewState>;
  width?: number;
  height?: number;
}

declare global {
  interface Window {
    WEBSHOT_READY: boolean;
  }
}

export const LayerWebshot = ({
  layer,
  basemap = 'light',
  viewState = { zoom: 0, latitude: 15, longitude: -35 },
  width = 256,
  height = 256,
}: MapThumbnailProps): JSX.Element => {
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [dataURL, setDataURL] = useState<string>(null);
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
    if (isLoaded && !dataURL) {
      handleBasemap(basemap);
      window.setTimeout(() => {
        setDataURL(mapRef.current.getCanvas().toDataURL());
        window.WEBSHOT_READY = true;
      }, 8000);
    }
  }, [basemap, isLoaded, dataURL, handleBasemap]);

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
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {dataURL && (
        <Image width={width} height={height} src={dataURL} alt={layer.slug} id="webshot-content" />
      )}
      {!dataURL && (
        <StaticMap
          ref={(_map) => {
            if (_map) mapRef.current = _map.getMap();
          }}
          mapboxApiAccessToken={
            process.env.NEXT_PUBLIC_RW_MAPBOX_API_TOKEN || process.env.STORYBOOK_RW_MAPBOX_API_TOKEN
          }
          viewState={viewState}
          mapStyle={MAPSTYLES}
          className="mapbox-thumbnail"
          onLoad={handleMapLoad}
          attributionControl={false}
          reuseMaps
          preserveDrawingBuffer
          styleDiffing
        >
          {isLoaded && <LayerManager map={mapRef.current} layers={parsedLayer} />}
        </StaticMap>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id, ...queryParams } = query;

  const layer = await fetchLayer(id as string);

  return {
    props: {
      layer,
      ...queryParams,
    },
  };
};

export default LayerWebshot;

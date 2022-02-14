import { useEffect, useState, useRef, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import ReactMapGL, { MapRef } from 'react-map-gl';
import type { MapProps, ViewState, ViewStateChangeEvent } from 'react-map-gl';

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES } from './constants';

import { Basemap, Labels } from './types';

export interface CustomMapProps extends MapProps {
  /** A function that returns the map instance */
  // children?: React.ReactNode;
  children?: (map) => JSX.Element;

  /** Custom css class for styling */
  className?: string;

  /** An object that defines the viewport */
  viewport?: Partial<ViewState>;

  /** basemap displayed */
  basemap?: Basemap;

  /** labels displayed */
  labels?: Labels;

  /** show/hide boundaries */
  boundaries?: boolean;

  /** An object that defines the bounds */
  bounds?: {
    bbox: number[];
    options?: Record<string, unknown>;
    viewportOptions?: Partial<ViewState>;
  };

  /** A function that exposes when the map is loaded.
   * It receives and object with the `mapRef` and `mapContainerRef` reference. */
  onMapLoad?: ({ map, mapContainer }) => void;

  // getCursor?:

  /** A function that exposes the viewport */
  onMapViewportChange?: (viewport: Partial<ViewState>) => void;
  /** Optional callback when bounds are changed  */
  onFitBoundsChange?: (viewport: Partial<ViewState>) => void;
}

export const Map = ({
  children,
  className,
  viewport,
  bounds,
  basemap = 'dark',
  labels = 'light',
  boundaries = false,
  style = {},
  onMapLoad,
  onMapViewportChange,
  dragPan,
  dragRotate,
  scrollZoom,
  // touchZoom,
  // touchRotate,
  doubleClickZoom,
  onFitBoundsChange,
  cursor,
  ...mapboxProps
}: CustomMapProps): JSX.Element => {
  const mapRef = useRef<MapRef>(null);
  const mapContainerRef = useRef(null);

  const [mapViewport, setViewport] = useState<ViewState>(DEFAULT_VIEWPORT as ViewState);
  const [flying, setFlight] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    if (onMapLoad) onMapLoad({ map: mapRef.current, mapContainer: mapContainerRef.current });
  }, [onMapLoad]);

  const debouncedOnMapViewportChange = useDebouncedCallback((v) => {
    if (onMapViewportChange) onMapViewportChange(v);
  }, 250);

  const handleViewportChange = useCallback(
    (evt: ViewStateChangeEvent) => {
      const { viewState } = evt;
      setViewport(viewState);
      debouncedOnMapViewportChange(viewState);
    },
    [debouncedOnMapViewportChange],
  );

  const handleResize = useCallback(
    (v) => {
      const newViewport = {
        ...mapViewport,
        ...v,
      };

      setViewport(newViewport);
      debouncedOnMapViewportChange(newViewport);
    },
    [mapViewport, debouncedOnMapViewportChange],
  );

  const handleFitBounds = useCallback(() => {
    const { bbox, options = {}, viewportOptions = {} } = bounds;
    const { transitionDuration = 0 } = options;

    if (!mapRef.current) return null;

    if (mapContainerRef.current.offsetWidth <= 0 || mapContainerRef.current.offsetHeight <= 0) {
      throw new Error("mapContainerRef doesn't have any dimensions");
    }

    // const { longitude, latitude, zoom } = fitBounds({
    //   width: mapContainerRef.current.offsetWidth,
    //   height: mapContainerRef.current.offsetHeight,
    //   bounds: [
    //     [bbox[0], bbox[1]],
    //     [bbox[2], bbox[3]],
    //   ],
    //   ...options,
    // });

    mapRef.current.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      options,
    );

    // const newViewport: Partial<ViewState> = {
    //   longitude,
    //   latitude,
    //   zoom,
    //   // transitionDuration,
    //   // transitionInterruption: TRANSITION_EVENTS.UPDATE,
    //   ...viewportOptions,
    // };

    // setFlight(true);
    // setViewport((prevViewport) => ({
    //   ...prevViewport,
    //   ...newViewport,
    // }));
    // debouncedOnMapViewportChange(newViewport);
    // if (onFitBoundsChange) onFitBoundsChange(newViewport);

    // return setTimeout(() => {
    //   setFlight(false);
    // }, +transitionDuration);
  }, [bounds, debouncedOnMapViewportChange, onFitBoundsChange, mapRef]);

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
        const match = _layer.metadata['mapbox:group'] === basemapToDisplay.id;
        if (!match) {
          mapRef.current.setLayoutProperty(_layer.id, 'visibility', 'none');
        } else {
          mapRef.current.setLayoutProperty(_layer.id, 'visibility', 'visible');
        }
      });
    },
    [mapRef],
  );

  const handleLabels = useCallback(
    (labels: Labels) => {
      const { current: map } = mapRef;
      const LABELS_GROUP = ['labels'];
      const { layers, metadata } = map.getStyle();

      const labelGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
        const { name } = metadata['mapbox:groups'][k];

        const matchedGroups = LABELS_GROUP.filter((rgr) => name.toLowerCase().includes(rgr));

        return matchedGroups.some((bool) => bool);
      });

      const labelsWithMeta = labelGroups.map((_groupId) => ({
        ...metadata['mapbox:groups'][_groupId],
        id: _groupId,
      }));
      const labelsToDisplay =
        labelsWithMeta.find((_basemap) => _basemap.name.includes(labels)) || {};

      const labelLayers = layers.filter((l) => {
        const { metadata: layerMetadata } = l;
        if (!layerMetadata) return false;

        const gr = layerMetadata['mapbox:group'];
        return labelGroups.includes(gr);
      });

      labelLayers.forEach((_layer) => {
        const match = _layer.metadata['mapbox:group'] === labelsToDisplay.id;
        map.setLayoutProperty(_layer.id, 'visibility', match ? 'visible' : 'none');
      });
    },
    [mapRef],
  );

  const handleBoundaries = useCallback(
    (boundaries: boolean) => {
      const { current: map } = mapRef;
      const LABELS_GROUP = ['boundaries'];
      const { layers, metadata } = map.getStyle();

      const boundariesGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
        const { name } = metadata['mapbox:groups'][k];

        const labelsGroup = LABELS_GROUP.map((rgr) => name.toLowerCase().includes(rgr));

        return labelsGroup.some((bool) => bool);
      });

      const boundariesLayers = layers.filter((l) => {
        const { metadata: layerMetadata } = l;
        if (!layerMetadata) return false;

        const gr = layerMetadata['mapbox:group'];
        return boundariesGroups.includes(gr);
      });

      boundariesLayers.forEach((l) => {
        map.setLayoutProperty(l.id, 'visibility', boundaries ? 'visible' : 'none');
      });
    },
    [mapRef],
  );

  const handleGetCursor = useCallback(
    ({ isHovering, isDragging }: { isHovering: boolean; isDragging: boolean }): string => {
      if (isHovering) return 'pointer';
      if (isDragging) return 'grabbing';
      return 'grab';
    },
    [],
  );

  useEffect(() => {
    if (
      !isEmpty(bounds) &&
      !!bounds.bbox &&
      bounds.bbox.every((b) => typeof b === 'number') &&
      loaded
    ) {
      handleFitBounds();
    }
  }, [bounds, loaded, handleFitBounds]);

  useEffect(() => {
    setViewport((prevViewportState) => ({
      ...prevViewportState,
      ...viewport,
    }));
  }, [viewport]);

  useEffect(() => {
    if (loaded && basemap !== 'none') handleBasemap(basemap);
  }, [basemap, loaded, handleBasemap]);

  useEffect(() => {
    if (loaded) handleLabels(labels);
  }, [labels, loaded, handleLabels]);

  useEffect(() => {
    if (loaded) handleBoundaries(boundaries);
  }, [boundaries, loaded, handleBoundaries]);

  return (
    <div
      ref={mapContainerRef}
      className={cx({
        'relative w-full h-full z-0': true,
        [className]: !!className,
      })}
    >
      <ReactMapGL
        ref={(_map) => {
          if (_map) mapRef.current = _map.getMap();
        }}
        mapboxAccessToken={
          process.env.NEXT_PUBLIC_RW_MAPBOX_API_TOKEN || process.env.STORYBOOK_RW_MAPBOX_API_TOKEN
        }
        mapStyle={MAPSTYLES}
        {...mapboxProps}
        {...mapViewport}
        style={style}
        dragPan={!flying && dragPan}
        dragRotate={!flying && dragRotate}
        scrollZoom={!flying && scrollZoom}
        doubleClickZoom={!flying && doubleClickZoom}
        onMove={handleViewportChange}
        onResize={handleResize}
        onLoad={handleLoad}
        // cursor={cursor || handleGetCursor}
        transformRequest={(url, resourceType) => {
          // Global Fishing Watch tilers require authorization so we need to add
          // the header before Mapbox handles the request
          if (
            resourceType === 'Tile' &&
            url.startsWith('https://gateway.api.globalfishingwatch.org/')
          ) {
            return {
              url,
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN}`,
              },
            };
          }

          return null;
        }}
      >
        {loaded && !!mapRef.current && typeof children === 'function' && children(mapRef.current)}
      </ReactMapGL>
    </div>
  );
};

export default Map;

import { createRef, useRef, useState, useMemo, useCallback } from 'react';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Legend, LegendListItem, LegendItemTypes } from 'vizzuality-components';
import compact from 'lodash/compact';

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES, BASEMAPS, LABELS } from 'components/map/constants';

// components
import Spinner from 'components/ui/Spinner';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapboxCompare from 'components/map/plugins/compare/mapbox-compare';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import WidgetHeader from '../../header';
import WidgetInfo from '../../info';
import WidgetCaption from '../../caption';

// utils
import { getLayerAttributions } from 'utils/layers';

import type { ViewportProps } from 'react-map-gl';
import type { APIWidgetSpec } from 'types/widget';
import type { Bounds, LayerGroup, Basemap, Labels } from 'components/map/types';
import type { SwipeTypeWidgetContainerProps } from './index';

export interface LayerGroupsBySide {
  left: LayerGroup[];
  right: LayerGroup[];
}

export interface SwipeTypeWidgetProps extends Omit<SwipeTypeWidgetContainerProps, 'widgetId'> {
  layerGroupsBySide: LayerGroupsBySide;
  // todo: improve typing of layers
  aoiLayer?: Record<string, string | unknown>;
  maskLayer?: Record<string, string | unknown>;
  widget: APIWidgetSpec;
  bounds?: Bounds;
  isFetching?: boolean;
  isInACollection?: boolean;
  isError?: boolean;
  onFitBoundsChange: (viewport: ViewportProps) => void;
}

const SwipeTypeWidget = ({
  layerGroupsBySide,
  aoiLayer = null,
  maskLayer = null,
  params,
  bounds,
  widget,
  style = {},
  isEmbed = false,
  isWebshot = false,
  isInACollection = false,
  isFetching = false,
  isError = false,
  onToggleShare,
  onFitBoundsChange,
}: SwipeTypeWidgetProps): JSX.Element => {
  const [map, setMap] = useState({
    left: null,
    right: null,
  });
  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const swiperRef = createRef<HTMLDivElement>();
  const legendRef = useRef<HTMLDivElement>(null);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareToggle = useCallback(() => {
    onToggleShare(widget);
  }, [onToggleShare, widget]);

  const handleMapRefs = useCallback(
    (_map) => {
      setMap({
        ...map,
        ..._map,
      });
    },
    [map],
  );

  const handleFitBoundsChange = useCallback(
    (_viewport) => {
      if (onFitBoundsChange) onFitBoundsChange(_viewport);
    },
    [onFitBoundsChange],
  );

  const handleViewport = useDebouncedCallback((_viewport) => {
    setViewport(_viewport);
  }, 1);

  const handleZoom = useCallback((zoom) => {
    setViewport((prevViewport) => ({
      ...prevViewport,
      zoom,
      transitionDuration: 250,
    }));
  }, []);

  const basemap = useMemo(() => {
    const basemapKey = widget?.widgetConfig?.basemapLayers?.basemap || 'dark';

    return BASEMAPS[basemapKey].value as Basemap;
  }, [widget]);

  const labels = useMemo(() => {
    const label = widget?.widgetConfig?.basemapLayers?.labels || 'light';

    return LABELS[label].value as Labels;
  }, [widget]);

  const layersBySide = useMemo(
    () => ({
      left: [
        ...(aoiLayer !== null ? [aoiLayer] : []),
        ...(maskLayer !== null ? [maskLayer] : []),
        ...compact(
          layerGroupsBySide.left.map((_layerGroup) =>
            (_layerGroup.layers || []).find((_layer) => _layer.active),
          ),
        ),
      ],
      right: [
        ...(aoiLayer !== null ? [aoiLayer] : []),
        ...(maskLayer !== null ? [maskLayer] : []),
        ...compact(
          layerGroupsBySide.right.map((_layerGroup) =>
            (_layerGroup.layers || []).find((_layer) => _layer.active),
          ),
        ),
      ],
    }),
    [layerGroupsBySide, aoiLayer, maskLayer],
  );

  const boundaries = useMemo(
    () => Boolean(widget?.widgetConfig?.basemapLayers?.boundaries),
    [widget],
  );

  const caption = useMemo(() => widget?.metadata?.[0]?.info?.caption, [widget]);

  const attributions = useMemo(
    () => getLayerAttributions([...layersBySide.left, ...layersBySide.right]),
    [layersBySide],
  );

  return (
    <div
      className={classnames('c-widget', { '-is-embed': isEmbed })}
      style={{
        ...style,
      }}
    >
      {!isFetching && !isError && !isWebshot && (
        <div className="p-4 border border-b-0 rounded-tl rounded-tr widget-header-container border-gray-light">
          <WidgetHeader
            widget={widget}
            params={params}
            onToggleInfo={handleInfoToggle}
            onToggleShare={handleShareToggle}
            isInACollection={isInACollection}
            isInfoVisible={isInfoWidgetVisible}
          />
        </div>
      )}
      <div
        className={classnames(
          'relative flex h-full overflow-x-auto overflow-y-hidden widget-container grow rounded',
          {
            'border-0': !isInfoWidgetVisible,
            'rounded-none': caption,
          },
        )}
        style={{
          ...(!isEmbed && { height: 400 }),
        }}
      >
        {isFetching && <Spinner isLoading className="-transparent" />}

        <div className="relative w-full h-full overflow-hidden c-map-comparison">
          <div className="compare-container">
            {!isFetching && !isError && (
              <>
                {/* left map */}
                <Map
                  interactiveLayerIds={[]}
                  mapStyle={MAPSTYLES}
                  className="-compare"
                  basemap={basemap}
                  labels={labels}
                  boundaries={boundaries}
                  scrollZoom={false}
                  viewport={viewport}
                  bounds={bounds}
                  onFitBoundsChange={handleFitBoundsChange}
                  onMapLoad={({ map: _map }) => handleMapRefs({ left: _map })}
                >
                  {(_map) => <LayerManager map={_map} layers={layersBySide.left} />}
                </Map>

                {layersBySide.left.length > 0 && (
                  <div
                    className="c-legend-map"
                    style={{
                      left: 16,
                    }}
                  >
                    <Legend maxHeight={140} sortable={false} expanded={false}>
                      {layerGroupsBySide.left.map((lg, i) => (
                        <LegendListItem index={i} key={lg.id} layerGroup={lg}>
                          <LegendItemTypes />
                        </LegendListItem>
                      ))}
                    </Legend>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="compare-container">
            {!isFetching && !isError && (
              <>
                {/* right map */}
                {/* swiper */}
                <div ref={swiperRef} className="swiper-container mapboxgl-compare">
                  <div className="compare-swiper" />
                </div>
                <Map
                  interactiveLayerIds={[]}
                  mapStyle={MAPSTYLES}
                  className="-compare"
                  basemap={basemap}
                  labels={labels}
                  boundaries={boundaries}
                  scrollZoom={false}
                  viewport={viewport}
                  attributions={attributions}
                  bounds={bounds}
                  onMapViewportChange={handleViewport}
                  onMapLoad={({ map: _map }) => handleMapRefs({ right: _map })}
                >
                  {(_map) => <LayerManager map={_map} layers={layersBySide.right} />}
                </Map>

                <MapControls customClass="c-map-controls -embed">
                  <ZoomControls viewport={viewport} onClick={handleZoom} />
                </MapControls>

                {layersBySide.right.length > 0 && (
                  <div
                    className="c-legend-map"
                    style={{
                      right: 16,
                    }}
                  >
                    <Legend maxHeight={140} sortable={false} expanded={false}>
                      {layerGroupsBySide.right.map((lg, i) => (
                        <LegendListItem index={i} key={lg.id} layerGroup={lg}>
                          <LegendItemTypes />
                        </LegendListItem>
                      ))}
                    </Legend>
                  </div>
                )}
              </>
            )}
            {map.left && map.right && (
              <MapboxCompare
                leftRef={map.left}
                rightRef={map.right}
                swiper={swiperRef}
                options={{
                  swiper: {
                    offset: legendRef.current
                      ? legendRef.current.getBoundingClientRect().height
                      : 0,
                  },
                }}
              />
            )}
          </div>
        </div>

        {isInfoWidgetVisible && widget && !isFetching && (
          <WidgetInfo widget={widget} className="p-4" />
        )}
      </div>
      {caption && <WidgetCaption text={caption} />}
    </div>
  );
};

export default SwipeTypeWidget;

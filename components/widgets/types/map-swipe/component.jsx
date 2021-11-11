import {
  createRef,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import {
  Legend,
  LegendListItem,
  LegendItemTypes,
} from 'vizzuality-components';
import compact from 'lodash/compact';

// constants
import {
  DEFAULT_VIEWPORT,
  MAPSTYLES,
  BASEMAPS,
  LABELS,
} from 'components/map/constants';

// components
import Spinner from 'components/ui/Spinner';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapboxCompare from 'components/map/plugins/compare/mapbox-compare';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import WidgetHeader from '../../header';
import WidgetInfo from '../../info';

export default function SwipeTypeWidget({
  layerGroupsBySide,
  aoiLayer,
  maskLayer,
  bounds,
  widget,
  style,
  isEmbed,
  isWebshot,
  isInACollection,
  isFetching,
  isError,
  onToggleShare,
  onFitBoundsChange,
}) {
  const [map, setMap] = useState({
    left: null,
    right: null,
  });
  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const swiperRef = createRef();
  const legendRef = useRef();

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareToggle = useCallback(() => {
    onToggleShare(widget);
  }, [onToggleShare, widget]);

  const handleMapRefs = useCallback((_map) => {
    setMap({
      ...map,
      ..._map,
    });
  }, [map]);

  const handleFitBoundsChange = useCallback((_viewport) => {
    onFitBoundsChange(_viewport);
  }, [onFitBoundsChange]);

  const [handleViewport] = useDebouncedCallback((_viewport) => {
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

    return BASEMAPS[basemapKey].value;
  }, [widget]);

  const labels = useMemo(() => {
    const label = widget?.widgetConfig?.basemapLayers?.labels || 'light';

    return LABELS[label].value;
  }, [widget]);

  const layersBySide = useMemo(() => ({
    left: [
      ...(aoiLayer !== null) ? [aoiLayer] : [],
      ...(maskLayer !== null) ? [maskLayer] : [],
      ...compact(layerGroupsBySide.left.map(
        (_layerGroup) => (_layerGroup.layers || []).find((_layer) => _layer.active),
      )),
    ],
    right: [
      ...(aoiLayer !== null) ? [aoiLayer] : [],
      ...(maskLayer !== null) ? [maskLayer] : [],
      ...compact(layerGroupsBySide.right.map(
        (_layerGroup) => (_layerGroup.layers || []).find((_layer) => _layer.active),
      )),
    ],
  }), [layerGroupsBySide, aoiLayer, maskLayer]);

  const caption = widget?.metadata?.[0]?.info?.caption;

  return (
    <div
      className={classnames('c-widget', { '-is-embed': isEmbed })}
      style={{
        height: '100%',
        ...style,
      }}
    >
      {(!isFetching && !isError && !isWebshot) && (
        <div className="widget-header-container">
          <WidgetHeader
            widget={widget}
            onToggleInfo={handleInfoToggle}
            onToggleShare={handleShareToggle}
            isInACollection={isInACollection}
            isInfoVisible={isInfoWidgetVisible}
          />
        </div>
      )}
      <div
        className="widget-container"
        style={{
          minHeight: 400,
          ...!isInfoWidgetVisible && { border: 0 },
        }}
      >
        {isFetching && (
          <Spinner
            isLoading
            className="-transparent"
          />
        )}

        <div
          className="c-map-comparison"
          style={{
            height: '100%',
          }}
        >
          <div className="compare-container">
            {(!isFetching && !isError) && (
            <>
              {/* left map */}
              <Map
                interactiveLayerIds={[]}
                mapStyle={MAPSTYLES}
                className="-compare"
                basemap={basemap}
                labels={labels}
                boundaries
                scrollZoom={false}
                viewport={viewport}
                bounds={bounds}
                onFitBoundsChange={handleFitBoundsChange}
                onLoad={({ map: _map }) => handleMapRefs({ left: _map })}
                fitBoundsOptions={{
                  transitionDuration: 0,
                }}
              >
                {(_map) => (
                  <LayerManager
                    map={_map}
                    layers={layersBySide.left}
                  />
                )}
              </Map>

              {(layersBySide.left.length > 0) && (
              <div
                className="c-legend-map"
                style={{
                  left: 16,
                }}
              >
                <Legend
                  maxHeight={140}
                  sortable={false}
                  expanded={false}
                >
                  {layerGroupsBySide.left.map((lg, i) => (
                    <LegendListItem
                      index={i}
                      key={lg.id}
                      layerGroup={lg}
                    >
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
            {(!isFetching && !isError) && (
            <>
              {/* right map */}
              {/* swiper */}
              <div
                ref={swiperRef}
                className="swiper-container mapboxgl-compare"
              >
                <div className="compare-swiper" />
              </div>
              <Map
                interactiveLayerIds={[]}
                mapStyle={MAPSTYLES}
                className="-compare"
                basemap={basemap}
                labels={labels}
                boundaries
                scrollZoom={false}
                viewport={viewport}
                onViewportChange={handleViewport}
                bounds={bounds}
                onLoad={({ map: _map }) => handleMapRefs({ right: _map })}
                fitBoundsOptions={{
                  transitionDuration: 0,
                }}
              >
                {(_map) => (
                  <LayerManager
                    map={_map}
                    layers={layersBySide.right}
                  />
                )}
              </Map>

              <MapControls customClass="c-map-controls -embed">
                <ZoomControls
                  viewport={viewport}
                  onClick={handleZoom}
                />
              </MapControls>

              {(layersBySide.right.length > 0) && (
              <div
                className="c-legend-map"
                style={{
                  right: 16,
                }}
              >
                <Legend
                  maxHeight={140}
                  sortable={false}
                  expanded={false}
                >
                  {layerGroupsBySide.right.map((lg, i) => (
                    <LegendListItem
                      index={i}
                      key={lg.id}
                      layerGroup={lg}
                    >
                      <LegendItemTypes />
                    </LegendListItem>
                  ))}
                </Legend>
              </div>
              )}
            </>
            )}
            {(map.left && map.right) && (
            <MapboxCompare
              leftRef={map.left}
              rightRef={map.right}
              swiper={swiperRef}
              options={{
                swiper: {
                  offset: legendRef.current
                    ? legendRef.current.getBoundingClientRect().height : 0,
                },
              }}
            />
            )}
          </div>
        </div>

        {(isInfoWidgetVisible && widget && !isFetching) && (
          <WidgetInfo
            widget={widget}
            style={{
              padding: 15,
            }}
          />
        )}
        {caption && (
          <div className="widget-caption-container">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

SwipeTypeWidget.defaultProps = {
  aoiLayer: null,
  maskLayer: null,
  bounds: {},
  style: {},
  isEmbed: false,
  isWebshot: false,
};

SwipeTypeWidget.propTypes = {
  layerGroupsBySide: PropTypes.shape({
    left: PropTypes.arrayOf(PropTypes.shape({})),
    right: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  aoiLayer: PropTypes.shape({}),
  maskLayer: PropTypes.shape({}),
  widget: PropTypes.shape({
    widgetConfig: PropTypes.shape({
      basemapLayers: PropTypes.shape({
        basemap: PropTypes.string,
        labels: PropTypes.string,
      }),
    }),
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          caption: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  style: PropTypes.shape({}),
  isEmbed: PropTypes.bool,
  isWebshot: PropTypes.bool,
  isInACollection: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  bounds: PropTypes.shape({
    bbox: PropTypes.arrayOf(PropTypes.number),
    options: PropTypes.shape({}),
  }),
  onToggleShare: PropTypes.func.isRequired,
  onFitBoundsChange: PropTypes.func.isRequired,
};

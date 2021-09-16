import {
  useState,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Legend,
  LegendListItem,
  LegendItemToolbar,
  LegendItemButtonLayers,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemTypes,
} from 'vizzuality-components';
import { useDebouncedCallback } from 'use-debounce';
import {
  useErrorHandler,
} from 'react-error-boundary';

// constants
import {
  DEFAULT_VIEWPORT,
  MAPSTYLES,
  BASEMAPS,
  LABELS,
} from 'components/map/constants';

// utils
import {
  parseBbox,
} from 'components/map/utils';

// components
import Spinner from 'components/ui/Spinner';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import WidgetHeader from '../../header';
import WidgetInfo from '../../info';

// reducers
import {
  mapWidgetInitialState,
  mapWidgetSlice,
} from './reducer';

const mapWidgetReducer = mapWidgetSlice.reducer;

const {
  setMapLayerGroups,
  setMapLayerGroupVisibility,
  setMapLayerGroupActive,
  setMapLayerGroupsOrder,
  setMapLayerGroupOpacity,
} = mapWidgetSlice.actions;

export default function MapTypeWidget({
  widget,
  layerGroups,
  aoiLayer,
  maskLayer,
  style,
  isEmbed,
  isWebshot,
  isFetching,
  isError,
  isInACollection,
  mapBounds,
  onToggleShare,
  onFitBoundsChange,
}) {
  const handleError = useErrorHandler(isError ? new Error('something went wrong') : null);
  const [mapWidgetState, dispatch] = useReducer(mapWidgetReducer, ({
    ...mapWidgetInitialState,
    layerGroups,
  }));
  const [viewport, setViewport] = useState({
    ...DEFAULT_VIEWPORT,
    height: 400,
  });
  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);

  const [handleViewport] = useDebouncedCallback((_viewport) => {
    setViewport(_viewport);
  }, 250);

  const handleFitBoundsChange = useCallback((_viewport) => {
    onFitBoundsChange(_viewport);
  }, [onFitBoundsChange]);

  const handleZoom = useCallback((zoom) => {
    setViewport(((prevViewport) => ({
      ...prevViewport,
      zoom,
      transitionDuration: 250,
    })));
  }, []);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareToggle = useCallback(() => {
    onToggleShare(widget);
  }, [onToggleShare, widget]);

  const onChangeOpacity = useCallback((l, opacity) => {
    dispatch(setMapLayerGroupOpacity({
      dataset:
      {
        id: l.dataset,
      },
      opacity,
    }));
  }, []);

  const onChangeVisibility = useCallback((l, visibility) => {
    dispatch(setMapLayerGroupVisibility({
      dataset: { id: l.dataset },
      visibility,
    }));
  }, []);

  const onChangeLayer = useCallback((l) => {
    dispatch(setMapLayerGroupActive({
      dataset: {
        id: l.dataset,
      },
      active: l.id,
    }));
  }, []);

  const onChangeOrder = useCallback((datasetIds) => {
    dispatch(setMapLayerGroupsOrder({ datasetIds }));
  }, []);

  const basemap = useMemo(() => {
    if (!widget?.widgetConfig) return ({});

    const basemapKey = widget.widgetConfig?.basemapLayers?.basemap || 'dark';

    return BASEMAPS[basemapKey].value;
  }, [widget]);

  const labels = useMemo(() => {
    if (!widget?.widgetConfig) return ({});

    const label = widget.widgetConfig?.basemapLayers?.labels || 'light';

    return LABELS[label].value;
  }, [widget]);

  const bounds = useMemo(() => {
    if (mapBounds) return mapBounds;

    if (!widget?.widgetConfig?.bbox) return ({});

    return ({
      bbox: parseBbox(widget.widgetConfig.bbox),
    });
  }, [widget, mapBounds]);

  const boundaries = useMemo(() => !!widget?.widgetConfig?.basemapLayers?.boundaries, [widget]);

  const caption = widget?.metadata?.[0]?.info?.caption;

  useEffect(() => {
    dispatch(setMapLayerGroups(layerGroups));
  }, [layerGroups]);

  const layers = useMemo(
    () => {
      const activeLayers = mapWidgetState.layerGroups.map(
        (_layerGroup) => (_layerGroup.layers || []).find((_layer) => _layer.active),
      );

      return [
        ...(aoiLayer !== null) ? [aoiLayer] : [],
        ...(maskLayer !== null) ? [maskLayer] : [],
        ...activeLayers.filter(Boolean),
      ];
    },
    [mapWidgetState, aoiLayer, maskLayer],
  );

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
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          {(!isFetching && !isError) && (
          <>
            <Map
              mapStyle={MAPSTYLES}
              viewport={viewport}
              basemap={basemap}
              onViewportChange={handleViewport}
              onFitBoundsChange={handleFitBoundsChange}
              labels={labels}
              scrollZoom={false}
              bounds={bounds}
              boundaries={boundaries}
              fitBoundsOptions={{
                transitionDuration: 0,
              }}
              onError={(errorMessage) => {
                handleError(new Error(errorMessage));
              }}
            >
              {(_map) => (
                <LayerManager
                  map={_map}
                  layers={layers}
                />
              )}
            </Map>
            {!isWebshot && (
              <MapControls customClass="c-map-controls -embed">
                <ZoomControls
                  viewport={viewport}
                  onClick={handleZoom}
                />
              </MapControls>
            )}

            {(layers.length > 0) && (
            <div className="c-legend-map -embed">
              <Legend
                maxHeight={140}
                onChangeOrder={onChangeOrder}
              >
                {mapWidgetState.layerGroups.map((lg, i) => (
                  <LegendListItem
                    index={i}
                    key={lg.id}
                    layerGroup={lg}
                    {...layerGroups.length > 1 && {
                      toolbar: (
                        <LegendItemToolbar>
                          <LegendItemButtonLayers />
                          <LegendItemButtonOpacity />
                          <LegendItemButtonVisibility />
                        </LegendItemToolbar>
                      ),
                    }}
                    onChangeOpacity={onChangeOpacity}
                    onChangeVisibility={onChangeVisibility}
                    onChangeLayer={onChangeLayer}
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
        {(isInfoWidgetVisible && widget && !isFetching) && (
          <WidgetInfo
            widget={widget}
            style={{
              padding: 15,
            }}
          />
        )}
      </div>
      {caption && (
        <div className="widget-caption-container">
          {caption}
        </div>
      )}
    </div>
  );
}

MapTypeWidget.defaultProps = {
  layerGroups: [],
  aoiLayer: null,
  mapBounds: null,
  maskLayer: null,
  style: {},
  isEmbed: false,
  isWebshot: false,
  isFetching: false,
  isError: false,
  isInACollection: false,
};

MapTypeWidget.propTypes = {
  widget: PropTypes.shape({
    widgetConfig: PropTypes.shape({
      basemapLayers: PropTypes.shape({
        basemap: PropTypes.string,
        labels: PropTypes.string,
        boundaries: PropTypes.bool,
      }),
      bbox: PropTypes.arrayOf(
        PropTypes.number,
      ),
    }),
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          caption: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  layerGroups: PropTypes.arrayOf(PropTypes.shape()),
  aoiLayer: PropTypes.shape({
    bbox: PropTypes.arrayOf(
      PropTypes.number,
    ),
  }),
  mapBounds: PropTypes.shape({}),
  maskLayer: PropTypes.shape({}),
  style: PropTypes.shape({}),
  isEmbed: PropTypes.bool,
  isWebshot: PropTypes.bool,
  isFetching: PropTypes.bool,
  isError: PropTypes.bool,
  isInACollection: PropTypes.bool,
  onToggleShare: PropTypes.func.isRequired,
  onFitBoundsChange: PropTypes.func.isRequired,
};

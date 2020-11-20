import { createSelector, createStructuredSelector } from 'reselect';

// constants
import { BASEMAPS, LABELS, DEFAULT_VIEWPORT } from 'components/map/constants';

// selectors
import {
  getUpdatedLayers,
  getActiveLayers,
  getUpdatedLayerGroups,
  getActiveInteractiveLayers,
} from 'components/map/selectors';

// utils
import {
  parseBbox,
} from 'components/map/utils';

// states
export const getWidget = (state, props) => {
  const {
    fetchWidgetState: {
      data,
    },
  } = props;

  return data;
};

const getLayer = (state, props) => {
  const {
    fetchLayerState: {
      data,
    },
  } = props;

  return data;
};

export const getIsLoading = (state, props) => {
  const {
    fetchWidgetState: {
      isFetching: isWidgetFetching,
      isFetchedAfterMount: isWidgetFetchedAfterMount,
    },
    fetchLayerState: {
      isFetching: isLayerFetching,
      isFetchedAfterMount: isLayerFetchedAfterMount,
    },
  } = props;

  if (isWidgetFetchedAfterMount || isLayerFetchedAfterMount) {
    return (isWidgetFetching || isLayerFetching);
  }

  return true;
};

export const getIsError = (state, props) => {
  const {
    fetchWidgetState: {
      isError: isWidgetError,
    },
    fetchLayerState: {
      isError: isLayerError,
    },
  } = props;

  return (isWidgetError || isLayerError);
};

const getLayerGroups = createSelector(
  [getWidget, getLayer],
  (_widget, _layer) => {
    if (!_layer) return [];

    return [{
      dataset: _widget.dataset,
      visible: true,
      layers: [{
        active: true,
        ..._layer,
      }],
    }];
  },
);

const getParametrization = () => ({});

export const embedWidgetMapGetUpdatedLayerGroups = getUpdatedLayerGroups(getLayerGroups);
export const embedWidgetMapGetActiveLayers = getActiveLayers(getLayerGroups);
export const embedWidgetMapGetUpdatedLayers = getUpdatedLayers(
  embedWidgetMapGetActiveLayers,
  getParametrization,
);
export const embedWidgetMapGetActiveInteractiveLayers = getActiveInteractiveLayers(
  embedWidgetMapGetActiveLayers,
);

export const getViewport = createSelector(
  [getWidget],
  (_widget = {}) => {
    if (!_widget?.widgetConfig) return DEFAULT_VIEWPORT;
    const { widgetConfig } = _widget;

    return ({
      ...DEFAULT_VIEWPORT,
      ...('zoom' in widgetConfig) && { zoom: widgetConfig.zoom },
      ...('lat' in widgetConfig) && { latitude: widgetConfig.lat },
      ...('lng' in widgetConfig) && { longitude: widgetConfig.lng },
      ...('pitch' in widgetConfig) && { pitch: widgetConfig.pitch },
      ...('bearing' in widgetConfig) && { bearing: widgetConfig.bearing },
    });
  },
);

export const getBasemap = createSelector(
  [getWidget],
  (_widget = {}) => {
    if (_widget?.widgetConfig?.basemapLayers?.basemap) {
      return _widget.widgetConfig.basemapLayers.basemap;
    }

    return BASEMAPS.dark.value;
  },
);

export const getLabel = createSelector(
  [getWidget],
  (_widget = {}) => {
    // if the incoming value exists but it is 'null' we assume
    // the user doesn't want to show any label.
    if (_widget?.widgetConfig?.basemapLayers?.labels) return _widget.widgetConfig.basemapLayers.labels || 'none';

    return LABELS.light.value;
  },
);

export const getBoundaries = createSelector(
  [getWidget],
  (_widget = {}) => {
    if (_widget?.widgetConfig?.basemapLayers?.boundaries) {
      return _widget.widgetConfig.basemapLayers.boundaries;
    }

    return false;
  },
);

export const getBounds = createSelector(
  [getWidget],
  (_widget = {}) => {
    if (_widget?.widgetConfig?.bbox) {
      return ({
        bbox: parseBbox(_widget.widgetConfig.bbox),
      });
    }

    return ({});
  },
);

export const getMapProps = createStructuredSelector({
  viewport: getViewport,
  basemap: getBasemap,
  labels: getLabel,
  boundaries: getBoundaries,
  bounds: getBounds,
});

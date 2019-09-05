import { createSelector, createStructuredSelector } from 'reselect';

// constants
import { BASEMAPS, LABELS, DEFAULT_VIEWPORT } from 'components/map/constants';

// selectors
import {
  getUpdatedLayers,
  getActiveLayers,
  getUpdatedLayerGroups,
  getActiveInteractiveLayers
} from 'components/map/selectors';

// states
const getWidget = state => state.widget.data;
const getLayerGroups = state => state.widget.layerGroups;
const getParametrization = () => ({});

export const embedWidgetMapGetUpdatedLayerGroups = getUpdatedLayerGroups(getLayerGroups);
export const embedWidgetMapGetActiveLayers = getActiveLayers(getLayerGroups);
export const embedWidgetMapGetUpdatedLayers = getUpdatedLayers(
  embedWidgetMapGetActiveLayers,
  getParametrization
);
export const embedWidgetMapGetActiveInteractiveLayers = getActiveInteractiveLayers(
  embedWidgetMapGetActiveLayers
);

export const getViewport = createSelector(
  [getWidget],
  (_widget = {}) => {
    if (!('widgetConfig' in _widget)) return DEFAULT_VIEWPORT;
    const { widgetConfig } = _widget;

    return ({
      ...DEFAULT_VIEWPORT,
      ...('zoom' in widgetConfig) && { zoom: widgetConfig.zoom },
      ...('lat' in widgetConfig) && { latitude: widgetConfig.lat },
      ...('lng' in widgetConfig) && { longitude: widgetConfig.lng },
      ...('pitch' in widgetConfig) && { pitch: widgetConfig.pitch },
      ...('bearing' in widgetConfig) && { bearing: widgetConfig.bearing }
    });
  }
);

export const getBasemap = createSelector(
  [getWidget],
  (_widget = {}) => {
    if (
      'widgetConfig' in _widget &&
      'basemapLayers' in _widget.widgetConfig &&
      'basemap' in _widget.widgetConfig.basemapLayers) {
      return _widget.widgetConfig.basemapLayers.basemap;
    }

    return BASEMAPS.dark.value;
  }
);

export const getLabel = createSelector(
  [getWidget],
  (_widget = {}) => {
    // if the incoming value exists but it is 'null' we asume
    // the user doesn't want to show any label.
    if (
      'widgetConfig' in _widget &&
      'basemapLayers' in _widget.widgetConfig &&
      'labels' in _widget.widgetConfig.basemapLayers) {
      return _widget.widgetConfig.basemapLayers.labels ?
        _widget.widgetConfig.basemapLayers.labels : 'none';
    }

    return LABELS.light.value;
  }
);

export const getBoundaries = createSelector(
  [getWidget],
  (_widget = {}) => {
    if (
      'widgetConfig' in _widget &&
      'basemapLayers' in _widget.widgetConfig &&
      'boundaries' in _widget.widgetConfig.basemapLayers) {
      return _widget.widgetConfig.basemapLayers.boundaries;
    }

    return false;
  }
);

export const getBounds = createSelector(
  [getWidget],
  (_widget = {}) => {
    if (
      'widgetConfig' in _widget &&
      'bbox' in _widget.widgetConfig) {
      return ({ bbox: _widget.widgetConfig.bbox });
    }

    return ({});
  }
);

export const getMapProps = createStructuredSelector({
  viewport: getViewport,
  basemap: getBasemap,
  labels: getLabel,
  boundaries: getBoundaries,
  bounds: getBounds
});

export default {
  embedWidgetMapGetUpdatedLayerGroups,
  embedWidgetMapGetActiveLayers,
  embedWidgetMapGetUpdatedLayers,
  embedWidgetMapGetActiveInteractiveLayers,
  getMapProps
};

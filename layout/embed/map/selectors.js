import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import moment from 'moment';

// constants
import { BASEMAPS, LABELS, DEFAULT_VIEWPORT } from 'components/map/constants';

// utils
import { reduceParams, reduceSqlParams, getTimelineParams } from 'utils/layers/params-parser';

const getLayerGroups = state => state.widget.layerGroups;
const getParametrization = state => state.explore.map.parametrization;
const getWidget = state => state.widget.data;

export const getUpdatedLayerGroups = createSelector(
  [getLayerGroups],
  _layerGroups => _layerGroups.map(_layerGroup => ({
    ..._layerGroup,
    layers: _layerGroup.layers.map((_layer) => {
      const timelineParams = getTimelineParams({
        ..._layer.layerConfig.timeline_config,
        ..._layer.layerConfig.decode_config && (
          _layer.layerConfig.decode_config.reduce((acc, curr) => ({
            ...acc,
            [curr.key]: curr.default
          }), {}))
      });

      return ({
        ..._layer,
        ..._layer.layerConfig.timeline_config &&
          {
            // all params should go under timeline_config attribute
            timelineParams
          }
      });
    })
  }))
);

export const getActiveLayers = createSelector(
  [getUpdatedLayerGroups],
  (_layerGroups = []) => {
    const activeLayers = _layerGroups.map(lg => ({
      ...lg.layers.find(l => l.active),
      opacity: (typeof lg.opacity !== 'undefined') ? lg.opacity : 1,
      visibility: (typeof lg.visibility !== 'undefined') ? lg.visibility : true
    }));

    return activeLayers;
  }
);

export const getActiveInteractiveLayers = createSelector(
  [getActiveLayers],
  _activeLayers => flatten(compact(_activeLayers.map((_activeLayer) => {
    const { id, layerConfig, interactionConfig } = _activeLayer;
    if (isEmpty(layerConfig) || isEmpty(interactionConfig)) return null;

    const { body = {} } = layerConfig;
    const { vectorLayers } = body;

    if (vectorLayers) {
      return vectorLayers.map((l, i) => {
        const {
          id: vectorLayerId,
          type: vectorLayerType
        } = l;
        return vectorLayerId || `${id}-${vectorLayerType}-${i}`;
      });
    }

    return null;
  })))
);

export const getUpdatedLayers = createSelector(
  [getActiveLayers, getParametrization],
  (_activeLayers = [], _parametrization) => {
    if (!(Object.keys(_parametrization).length)) {
      return _activeLayers.map((_activeLayer) => {
        const reducedDecodeParams = reduceParams(_activeLayer.layerConfig.decode_config);
        const { startDate, endDate } = reducedDecodeParams || {};

        return {
          ..._activeLayer,
          ..._activeLayer.layerConfig.params_config && {
            params: {
              ...reduceParams(_activeLayer.layerConfig.params_config),
              ...!!_activeLayer.layerConfig.body.url && { url: _activeLayer.layerConfig.body.url }
            }
          },
          ..._activeLayer.layerConfig.sql_config &&
            { sqlParams: reduceSqlParams(_activeLayer.layerConfig.sql_config) },
          ..._activeLayer.layerConfig.decode_config && {
            decodeParams: {
              ...reducedDecodeParams,
              ...(startDate && {
                startYear: moment(startDate).year(),
                startMonth: moment(startDate).month(),
                startDay: moment(startDate).dayOfYear()
              }),
              ...(endDate && {
                endYear: moment(endDate).year(),
                endMonth: moment(endDate).month(),
                endDay: moment(endDate).dayOfYear()
              })
            }
          }
        };
      });
    }

    Object.keys(_parametrization).forEach((layerId) => {
      const indexLayer = _activeLayers.findIndex(_layer => _layer.id === layerId);

      if (indexLayer === -1) return;
      let currentLayer = _activeLayers[indexLayer];

      const { layerConfig } = currentLayer;
      const {
        params_config: paramsConfig,
        decode_config: decodeConfig,
        sql_config: sqlConfig,
        timeline_config: timelineConfig
      } = layerConfig;
      const {
        params: newParams,
        decodeParams: newDecodeParams,
        sqlParams: newSQLParams,
        timeline_config: newTimelineConfig
      } = _parametrization[layerId];
      const { startDate, endDate } = newDecodeParams || {};

      currentLayer = {
        ...currentLayer,
        ...paramsConfig && {
          params: {
            ...reduceParams(paramsConfig),
            ...!!currentLayer.layerConfig.body.url && { url: currentLayer.layerConfig.body.url },
            ...newParams
          }
        },
        ...sqlConfig && {
          sqlParams: {
            ...reduceSqlParams(sqlConfig),
            ...newSQLParams
          }
        },
        ...decodeConfig && {
          decodeParams: {
            ...reduceParams(decodeConfig),
            ...newDecodeParams,
            ...(startDate && {
              startYear: moment(startDate).year(),
              startMonth: moment(startDate).month(),
              startDay: moment(startDate).dayOfYear()
            }),
            ...(endDate && {
              endYear: moment(endDate).year(),
              endMonth: moment(endDate).month(),
              endDay: moment(endDate).dayOfYear()
            })
          }
        },
        ...timelineConfig && { timelineParams: { ...newTimelineConfig } }
      };

      _activeLayers[indexLayer] = currentLayer;
    });

    return [..._activeLayers];
  }
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
  getUpdatedLayers,
  getActiveInteractiveLayers,
  getUpdatedLayerGroups,
  getMapProps
};

import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import moment from 'moment';

// constants
import { BASEMAPS, BOUNDARIES } from 'components/map/constants';

// utils
import { reduceParams, reduceSqlParams, getTimelineParams } from 'utils/layers/params-parser';

const getLayerGroups = state => state.explore.map.layerGroups;
const getParametrization = state => state.explore.map.parametrization;
const getBoundaries = state => state.explore.map.boundaries;
const getBasemapId = state => state.explore.map.basemap;

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
  [getUpdatedLayerGroups, getBoundaries],
  (_layerGroups = [], _boundaries) => {
    const activeLayers = _layerGroups.map(lg => ({
      ...lg.layers.find(l => l.active),
      opacity: (typeof lg.opacity !== 'undefined') ? lg.opacity : 1,
      visibility: (typeof lg.visibility !== 'undefined') ? lg.visibility : true
    }));

    if (_boundaries) {
      activeLayers.unshift({
        id: 'dark-boundaries',
        active: true,
        provider: 'leaflet',
        opacity: 1,
        visibility: true,
        layerConfig: {
          type: 'tileLayer',
          url: BOUNDARIES.dark.value,
          body: {}
        }
      });
    }

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
        const { startDate, endDate } = reducedDecodeParams || {};

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

export const getBasemap = createSelector(
  [getBasemapId],
  _basemapId => BASEMAPS[_basemapId]
);


export default {
  getUpdatedLayers,
  getActiveInteractiveLayers,
  getUpdatedLayerGroups,
  getBasemap
};

import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import moment from 'moment';

// utils
import { reduceParams, reduceSqlParams, getTimelineParams } from 'utils/layers/params-parser';

// The next selectors are factories: provide them the needed data before using them.
// Otherwise, they won't work. You can check some examples in:
// - layout/explore/explore-map/selectors
// - layout/embed/map/selectors

export const getUpdatedLayerGroups = statePointer => createSelector(
  [statePointer],
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
          },
        ..._layer.layerConfig.layerType && { layerType: _layer.layerConfig.layerType }
      });
    })
  }))
);

export const getActiveLayers = (statePointer) => createSelector(
  [statePointer],
  (_layerGroups = []) => {    
    const activeLayers = _layerGroups.filter(lg => lg.layers.length > 0).map(lg => ({
      ...lg.layers.find(l => l.active),
      opacity: (typeof lg.opacity !== 'undefined') ? lg.opacity : 1,
      visibility: (typeof lg.visibility !== 'undefined') ? lg.visibility : true
    }));

    return activeLayers;
  }
);

export const getActiveInteractiveLayers = statePointer => createSelector(
  [statePointer],
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

export const getUpdatedLayers = (activeLayersPointer, parametrizationPointer) => createSelector(
  [activeLayersPointer, parametrizationPointer],
  (_activeLayers = [], _parametrization) => {
    if (!(Object.keys(_parametrization).length)) {      
      return _activeLayers.map((_activeLayer) => {        
        // User Area of Interest (Currently being used in the GEDC Energy dashboard)
        if (_activeLayer.id === 'user_area') {
          return _activeLayer;
        } else {
          const reducedDecodeParams = reduceParams(_activeLayer.layerConfig.decode_config);
          const { startDate, endDate } = reducedDecodeParams || {};
  
          return {
            ..._activeLayer,
            ..._activeLayer.layerConfig.layerType && { layerType: _activeLayer.layerConfig.layerType },
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
        }
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

export default {
  getUpdatedLayerGroups,
  getActiveLayers,
  getUpdatedLayers,
  getActiveInteractiveLayers
};

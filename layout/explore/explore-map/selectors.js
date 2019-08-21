import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';

// constants
import { BASEMAPS, LABELS } from 'components/map/constants';

// utils
import { reduceParams, reduceSqlParams, getTimelineParams } from 'utils/layers/params-parser';

const getLayerGroups = state => state.explore.map.layerGroups;
const getParametrization = state => state.explore.map.parametrization;
const getBasemapId = state => state.explore.map.basemap;
const getLabelId = state => state.explore.map.labels;

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
      return _activeLayers.map(_activeLayer => ({
        ..._activeLayer,
        ..._activeLayer.layerConfig.params_config && {
          params: {
            ...reduceParams(_activeLayer.layerConfig.params_config),
            ...!!_activeLayer.layerConfig.body.url && { url: _activeLayer.layerConfig.body.url }
          }
        },
        ..._activeLayer.layerConfig.sql_config &&
          { sqlParams: reduceSqlParams(_activeLayer.layerConfig.sql_config) },
        ..._activeLayer.layerConfig.decode_config &&
          { decodeParams: reduceParams(_activeLayer.layerConfig.decode_config) }
      }));
    }

    Object.keys(_parametrization).forEach((layerId) => {
      const indexLayer = _activeLayers.findIndex(_layer => _layer.id === layerId);

      if (indexLayer === -1) return;
      let currentLayer = _activeLayers[indexLayer];

      const { layerConfig } = currentLayer;
      const {
        params_config: paramsConfig,
        decode_config: decodeConfig,
        sql_config: sqlConfig
      } = layerConfig;
      const {
        params: newParams,
        decodeParams: newDecodeParams,
        sqlParams: newSQLParams
      } = _parametrization[layerId];

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
            ...newDecodeParams
          }
        }
      };

      _activeLayers[indexLayer] = currentLayer;
    });

    return _activeLayers;
  }
);

export const getBasemap = createSelector(
  [getBasemapId],
  _basemapId => BASEMAPS[_basemapId]
);

export const getLabel = createSelector(
  [getLabelId],
  _labelId => LABELS[_labelId]
);

export const getMapProps = createStructuredSelector({
  basemap: getBasemap,
  labels: getLabel
});


export default {
  getUpdatedLayers,
  getActiveInteractiveLayers,
  getBasemap
};

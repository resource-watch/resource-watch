import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';

// constants
import { BOUNDARIES } from 'components/ui/map/constants';

// utils
import { reduceParams, reduceSqlParams } from 'utils/layers/params-parser';

const getLayerGroups = state => state.explore.map.layerGroups;
const getParametrization = state => state.explore.map.parametrization;
const getBoundaries = state => state.explore.map.boundaries;

export const getActiveLayers = createSelector(
  [getLayerGroups, getBoundaries],
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
      return _activeLayers.map(_activeLayer => ({
        ..._activeLayer,
        ..._activeLayer.layerConfig.params_config && {
          params: {
            ...reduceParams(_activeLayer.layerConfig.params_config),
            ...!!_activeLayer.layerConfig.body.url && { url: _activeLayer.layerConfig.body.url }
          }
        },
        ..._activeLayer.layerConfig.sql_config && { sqlParams: reduceSqlParams(_activeLayer.layerConfig.sql_config) },
        ..._activeLayer.layerConfig.decode_config && { decodeParams: reduceParams(_activeLayer.layerConfig.decode_config) }
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


export default {
  getUpdatedLayers,
  getActiveInteractiveLayers
};

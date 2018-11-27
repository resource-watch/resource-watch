import { createSelector } from 'reselect';

// constants
import { BOUNDARIES } from 'components/ui/map/constants';

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

export const getUpdatedLayers = createSelector(
  [getActiveLayers, getParametrization],
  (_activeLayers = [], _parametrization) => {
    if (!(Object.keys(_parametrization).length)) return _activeLayers;

    Object.keys(_parametrization).forEach((layerId) => {
      const indexLayer = _activeLayers.findIndex(_layer => _layer.id === layerId);

      if (indexLayer !== -1) {
        const keyParams = _parametrization[layerId];

        Object.keys(keyParams).forEach((keyParam) => {
          _activeLayers[indexLayer] = {
            ..._activeLayers[indexLayer],
            ...{
              [keyParam]: keyParams[keyParam]
              // [keyParam]: Object.keys(keyParams[keyParam]).reduce((acc, v) =>
              //   ({ key: v, default: keyParams[keyParam][v] }))
            }

          };
        });
      }
    });

    return _activeLayers;
  }
);


export default { getUpdatedLayers };

import { flatten, compact, isEmpty } from 'lodash';

import { USER_AREA_LAYER_TEMPLATES } from 'components/map/constants';

export const getUserAreaLayer = (
  { id = 'user-area', geojson, minZoom },
  template = USER_AREA_LAYER_TEMPLATES['area-card'],
) => template({ id, geojson, minZoom });

/**
 *
 * @param {object[]} activeLayers Array of layers that mean to be interactive
 * @returns {string[]} Array of Mapbox layers ids that mean to be interactive
 */
export const getInteractiveLayers = (activeLayers) =>
  flatten(
    compact(
      activeLayers.map((_activeLayer) => {
        const { id, layerConfig } = _activeLayer;
        if (isEmpty(layerConfig)) return null;

        // * keeps backward compatibility for now
        const vectorLayers = layerConfig.render?.layers || layerConfig.body?.vectorLayers;

        if (vectorLayers) {
          return vectorLayers.map((l, i) => {
            const { id: vectorLayerId, type: vectorLayerType } = l;
            return vectorLayerId || `${id}-${vectorLayerType}-${i}`;
          });
        }

        return null;
      }),
    ),
  );

import { LayerSpec } from '@vizzuality/layer-manager';
import pick from 'lodash/pick';

import { APILayerSpec } from 'types/layer';

export const parseLayers = (layers: APILayerSpec[]): LayerSpec[] => {
  return layers.map((layer): LayerSpec => {
    const { id, type, layerConfig } = layer;
    const layerProps: LayerSpec = pick(layerConfig, [
      'deck',
      'decodeParams',
      'decodeFunction',
      'images',
      'interactivity',
      'opacity',
      'params',
      'sqlParams',
      'source',
      'render',
      'visibility',
      'zIndex',
    ]);

    return {
      id,
      type,
      ...layerProps,
    };
  });
};

export default {
  parseLayers,
};

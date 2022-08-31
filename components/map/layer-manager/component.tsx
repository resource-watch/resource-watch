import { useMemo } from 'react';
import { LayerManager as VizzLayerManager, Layer } from '@vizzuality/layer-manager-react';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import { LayerSpec } from '@vizzuality/layer-manager';
import type { MapRef } from 'react-map-gl';
import { APILayerSpec, DeckLayerSpec } from 'types/layer';

import ResourceWatchProviders from './providers';
import { parseLayers, isDeckLayer, parseDeckLayer } from './utils';

const LayerManager = ({ layers, map }: { map: MapRef; layers: APILayerSpec[] }): JSX.Element => {
  const parsedLayers = useMemo(() => parseLayers(layers), [layers]);

  const deckLayers = useMemo<DeckLayerSpec>(
    () => ({
      id: 'deck-layer',
      type: 'deck',
      deck: parsedLayers
        .filter((layer) => isDeckLayer(layer))
        .reduce((acc, next) => [...acc, ...parseDeckLayer(next)], []),
    }),
    [parsedLayers],
  );

  const restLayers = useMemo(
    () => parsedLayers.filter((layer) => !isDeckLayer(layer)),
    [parsedLayers],
  );

  // * non-deck layers are already sorted in an upper level of logic, but deck layers are not,
  // * so we need to sort both types of layers here before passing them down to the layer manager.
  const sortedLayers = useMemo(() => {
    const layers: (LayerSpec | DeckLayerSpec)[] = [...restLayers];
    const deckIndex = parsedLayers.findIndex((layer) => isDeckLayer(layer));

    if (deckIndex !== -1) layers.splice(deckIndex, 0, deckLayers);

    return layers;
  }, [restLayers, parsedLayers, deckLayers]);

  return (
    <VizzLayerManager map={map} plugin={PluginMapboxGl} providers={ResourceWatchProviders}>
      {sortedLayers.map((_layer) => (
        <Layer key={_layer.id} {..._layer} />
      ))}
    </VizzLayerManager>
  );
};

export default LayerManager;

import { useMemo } from 'react';
import { LayerManager as VizzLayerManager, Layer } from '@vizzuality/layer-manager-react';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import { MapRef } from 'react-map-gl';
import { APILayerSpec } from 'types/layer';

import ResourceWatchProviders from './providers';
import { parseLayers } from './utils';

// utils
// import CANVAS_DECODERS from 'utils/layers/canvas-decoders';

const LayerManager = ({ layers, map }: { map: MapRef; layers: APILayerSpec[] }): JSX.Element => {
  const parsedLayers = useMemo(() => parseLayers(layers), [layers]);

  return (
    <VizzLayerManager map={map} plugin={PluginMapboxGl} providers={ResourceWatchProviders}>
      {parsedLayers.map((_layer) => (
        <Layer
          key={_layer.id}
          {..._layer}
          // {...(_layer.decodeParams &&
          //   CANVAS_DECODERS[_layer.layerConfig.decoder] && {
          //     decodeFunction: CANVAS_DECODERS[_layer.layerConfig.decoder],
          //   })}
        />
      ))}
    </VizzLayerManager>
  );
};

export default LayerManager;

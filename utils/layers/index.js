import groupBy from 'lodash/groupBy';

// sorts layers based on an array of layer ids
export const sortLayers = (_layers = [], _layerOrder = []) => {
  if (!_layers.length || !_layerOrder.length) return _layers;

  const sortedLayers = [];
  // gets unpublished and disordered layers
  const restLayers = _layers.filter((_layer) => !_layerOrder.includes(_layer.id));

  // sets layers according layerOrder configuration
  _layerOrder.forEach((_order) => {
    const matchLayer = _layers.find((_layer) => _layer.id === _order);

    if (matchLayer) sortedLayers.push(matchLayer);
  });

  // merges both layer arrays to respect already ordered layers and others
  return [...sortedLayers, ...restLayers];
};

export const getTilerUrl = (layer) => {
  if (!layer) throw new Error('layer required to generate tiler URL');
  return `${process.env.NEXT_PUBLIC_WRI_API_URL}/v1/layer/${layer.id}/tile/gee/{z}/{x}/{y}`;
};

export const getLayerGroups = (layers = [], layerParams = {}) => {
  const layersByDataset = groupBy(layers, 'dataset');

  return Object.keys(layersByDataset).map((datasetKey) => ({
    id: datasetKey,
    visibility: true,
    layers: layersByDataset[datasetKey]
      .map((_layer) => ({
        ..._layer,
        active: _layer.default,
        opacity: layerParams?.[_layer.id]?.opacity || 1,
        ..._layer?.layerConfig?.type === 'gee' && {
          layerConfig: {
            ..._layer.layerConfig,
            body: {
              ..._layer.layerConfig.body,
              url: getTilerUrl(_layer),
            },
          },
        },
      })),
  }));
};

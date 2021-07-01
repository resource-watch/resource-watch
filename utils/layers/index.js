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

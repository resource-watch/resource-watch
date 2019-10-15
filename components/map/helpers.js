export const getLayerGroups = (datasets = []) => {
  if (!datasets.length) return [];

  return datasets.map(_dataset => ({
    dataset: _dataset.id,
    opacity: _dataset.opacity || 1,
    visibility: _dataset.visibility || true,
    layers: (_dataset.layers || []).map(_layer => ({
      ..._layer,
      active: _layer.active,
      opacity: _layer.opacity || 1,
      visibility: _layer.visibility || true
    }))
  }));
};


export default { getLayerGroups };

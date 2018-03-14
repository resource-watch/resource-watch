import * as actions from './explore-actions';

export default {
  //
  // DATASET
  //
  [actions.setDatasets]: (state, action) => {
    const datasets = { ...state.datasets, list: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsLoading]: (state, action) => {
    const datasets = { ...state.datasets, loading: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsError]: (state, action) => {
    const datasets = { ...state.datasets, error: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsPage]: (state, action) => {
    const datasets = { ...state.datasets, page: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsTotal]: (state, action) => {
    const datasets = { ...state.datasets, total: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsLimit]: (state, action) => {
    const datasets = { ...state.datasets, limit: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsMode]: (state, action) => {
    const datasets = { ...state.datasets, mode: action.payload };
    return { ...state, datasets };
  },


  //
  // FILTERS
  //
  [actions.setFiltersSearch]: (state, action) => {
    const filters = { ...state.filters, search: action.payload };
    return { ...state, filters };
  },


  //
  // MAP
  //
  [actions.setMapZoom]: (state, action) => {
    const map = { ...state.map, zoom: action.payload };
    return { ...state, map };
  },
  [actions.setMapLatLng]: (state, action) => {
    const map = { ...state.map, latLng: action.payload };
    return { ...state, map };
  },


  // LAYERS
  [actions.toggleMapLayerGroup]: (state, action) => {
    const layerGroups = [...state.map.layerGroups];
    const { dataset, toggle } = action.payload;

    if (toggle) {
      layerGroups.unshift({
        dataset: dataset.id,
        visible: true,
        layers: dataset.layer.map((l, index) => ({ ...l, active: index === 0 }))
      });
    } else {
      const index = layerGroups.findIndex(l => l.dataset === dataset.id);
      layerGroups.splice(index, 1);
    }

    // Return map
    const map = { ...state.map, layerGroups };
    return { ...state, map };
  },
  [actions.setMapLayerGroupVisibility]: (state, action) => {
    const { dataset, visibility } = action.payload;
    const layerGroups = state.map.layerGroups.map((lg) => {
      if (lg.dataset !== dataset.id) return lg;
      const layers = lg.layers.map(l => ({ ...l, visible: visibility }));
      return { ...lg, layers, visible: visibility };
    });

    const map = { ...state.map, layerGroups };
    return { ...state, map };
  },
  [actions.setMapLayerGroupOpacity]: (state, action) => {
    const { dataset, opacity } = action.payload;
    const layerGroups = state.map.layerGroups.map((lg) => {
      if (lg.dataset !== dataset.id) return lg;
      const layers = lg.layers.map(l => ({ ...l, opacity }));
      return { ...lg, layers, opacity };
    });

    const map = { ...state.map, layerGroups };
    return { ...state, map };
  },
  [actions.setMapLayerGroupActive]: (state, action) => {
    const { dataset, active } = action.payload;
    const layerGroups = state.map.layerGroups.map((lg) => {
      if (lg.dataset !== dataset.id) return lg;

      const layers = lg.layers.map(l => ({ ...l, active: l.id === active }));

      return { ...lg, layers };
    });

    const map = { ...state.map, layerGroups };
    return { ...state, map };
  },
  [actions.setMapLayerGroupsOrder]: (state, action) => {
    const { datasetIds } = action.payload;
    const layerGroups = [...state.map.layerGroups];

    // Sort by new order
    layerGroups.sort((a, b) =>
      (datasetIds.indexOf(a.dataset) > datasetIds.indexOf(b.dataset) ? 1 : -1));

    const map = { ...state.map, layerGroups };
    return { ...state, map };
  },


  //
  // SIDEBAR
  //
  [actions.setSidebarOpen]: (state, action) => {
    const sidebar = { ...state.sidebar, open: action.payload };
    return { ...state, sidebar };
  }
};

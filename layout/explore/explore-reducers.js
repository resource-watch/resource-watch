import * as actions from './explore-actions';
import initialState from './explore-default-state';

export default {
  // EXPLORE
  [actions.resetExplore]: () => initialState,
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
  [actions.setFiltersTab]: (state, action) => {
    const filters = { ...state.filters, tab: action.payload };
    return { ...state, filters };
  },
  [actions.setFiltersOpen]: (state, action) => {
    const filters = { ...state.filters, open: action.payload };
    return { ...state, filters };
  },


  // SORT
  [actions.setSortSelected]: (state, action) => {
    const sort = { ...state.sort, selected: action.payload };
    return { ...state, sort };
  },
  [actions.setSortDirection]: (state, action) => {
    const sort = { ...state.sort, direction: action.payload };
    return { ...state, sort };
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
  [actions.setMapBasemap]: (state, action) => {
    const map = { ...state.map, basemap: action.payload };
    return { ...state, map };
  },
  [actions.setMapLabels]: (state, action) => {
    const map = { ...state.map, labels: action.payload };
    return { ...state, map };
  },
  [actions.setMapBoundaries]: (state, action) => {
    const map = { ...state.map, boundaries: action.payload };
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

  [actions.setMapLayerGroups]: (state, action) => {
    const { datasets, params } = action.payload;
    // const paramsDatasetsIds = params.map(p => p.dataset);

    const layerGroups = datasets
      .map((d) => {
        const dParams = params.find(p => p.dataset === d.id);

        return {
          dataset: d.id,
          opacity: dParams.opacity,
          visible: dParams.visible,
          layers: d.layer.map(l => ({
            ...l,
            active: dParams.layer === l.id,
            opacity: dParams.opacity,
            visible: dParams.visible
          }))
        };
      })
      .sort((a, b) => {
        const aIndex = params.findIndex(p => p.dataset === a.dataset);
        const bIndex = params.findIndex(p => p.dataset === b.dataset);

        return (aIndex > bIndex ? 1 : -1);
      });


    const map = { ...state.map, layerGroups };
    return { ...state, map };
  },

  // INTERACTION
  [actions.setMapLayerGroupsInteraction]: (state, action) => {
    const layerGroupsInteraction = {
      ...state.map.layerGroupsInteraction,
      [action.payload.id]: action.payload
    };

    const map = { ...state.map, layerGroupsInteraction };
    return { ...state, map };
  },
  [actions.setMapLayerGroupsInteractionSelected]: (state, action) => {
    const map = { ...state.map, layerGroupsInteractionSelected: action.payload };
    return { ...state, map };
  },
  [actions.setMapLayerGroupsInteractionLatLng]: (state, action) => {
    const map = { ...state.map, layerGroupsInteractionLatLng: action.payload };
    return { ...state, map };
  },
  [actions.resetMapLayerGroupsInteraction]: (state) => {
    const map = {
      ...state.map,
      layerGroupsInteraction: {},
      layerGroupsInteractionLatLng: null,
      layerGroupsInteractionSelected: null
    };
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

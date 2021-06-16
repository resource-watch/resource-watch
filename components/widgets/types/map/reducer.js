import {
  createSlice,
} from '@reduxjs/toolkit';

export const mapWidgetInitialState = {
  layerGroups: [],
  layerGroupsInteraction: {},
  layerGroupsInteractionSelected: null,
  layerGroupsInteractionLatLng: null,
};

export const mapWidgetSlice = createSlice({
  name: 'map-widget',
  reducers: {
    setMapLayerGroupVisibility: (state, { payload }) => {
      const {
        dataset,
        visibility,
      } = payload;
      const layerGroups = state.layerGroups.map((lg) => {
        if (lg.id !== dataset.id) return lg;
        const updatedLayers = lg.layers.map((l) => ({ ...l, visibility }));
        return ({
          ...lg,
          layers: updatedLayers,
          visibility,
        });
      });

      return ({
        ...state,
        layerGroups,
      });
    },
    setMapLayerGroupOpacity: (state, { payload }) => {
      const { dataset, opacity } = payload;
      const layerGroups = state.layerGroups.map((lg) => {
        if (lg.id !== dataset.id) return lg;
        const layers = lg.layers.map((l) => ({ ...l, opacity }));
        return ({
          ...lg,
          layers,
          opacity,
        });
      });

      return ({
        ...state,
        layerGroups,
      });
    },
    setMapLayerGroupActive: (state, { payload }) => {
      const { dataset, active } = payload;
      const layerGroups = state.layerGroups.map((lg) => {
        if (lg.id !== dataset.id) return lg;

        return ({
          ...lg,
          layers: lg.layers.map((_layer) => ({
            ..._layer,
            active: _layer.id === active,
          })),
        });
      });

      return ({
        ...state,
        layerGroups,
      });
    },
    setMapLayerGroupsOrder: (state, { payload }) => {
      const { datasetIds } = payload;
      const layerGroups = [...state.layerGroups];

      // Sort by new order
      layerGroups.sort(
        (a, b) => (datasetIds.indexOf(a.dataset) > datasetIds.indexOf(b.dataset) ? 1 : -1),
      );

      return ({
        ...state,
        layerGroups,
      });
    },
  },
  initialState: mapWidgetInitialState,
});

export default mapWidgetSlice;

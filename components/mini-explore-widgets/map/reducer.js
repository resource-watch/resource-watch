import { createSlice } from '@reduxjs/toolkit';

// constants
import { BASEMAPS, LABELS } from 'components/map/constants';

// utils
import { sortLayers } from 'utils/layers';

export const initialState = {
  viewport: {
    zoom: 3,
    latitude: 0,
    longitude: 0,
    pitch: 0,
    bearing: 0,
    transitionDuration: 250,
  },
  bounds: {
    box: null,
    options: {},
  },
  basemapId: BASEMAPS.dark.id,
  labelsId: LABELS.light.id,
  boundaries: false,
  layerGroups: [],
  layerGroupsInteraction: {},
  layerGroupsInteractionSelected: null,
  layerGroupsInteractionLatLng: null,
  aoi: null,
  parametrization: {},
};

export const mapSlice = createSlice({
  name: 'mini-explore-widgets',
  reducers: {
    // map management
    setViewport: (state, { payload }) => ({
      ...state,
      viewport: {
        ...state.viewport,
        ...payload,
      },
    }),
    setBasemap: (state, { payload }) => ({
      ...state,
      basemapId: payload,
    }),
    setLabels: (state, { payload }) => ({
      ...state,
      labelsId: payload,
    }),
    setBounds: (state, { payload }) => ({
      ...state,
      bounds: payload,
    }),
    setBoundaries: (state, { payload }) => ({
      ...state,
      boundaries: payload,
    }),
    setAreaOfInterest: (state, { payload }) => ({
      ...state,
      aoi: payload,
    }),
    // layer management
    setMapLayerGroups: (state, { payload }) => ({
      ...state,
      layerGroups: payload,
    }),
    toggleMapLayerGroup: (state, { payload }) => {
      const layerGroups = [...state.layerGroups];
      const { dataset, toggle } = payload;
      const { applicationConfig, layer } = dataset;

      let layers = layer;

      // sorts layers if applies
      if (
        applicationConfig &&
        applicationConfig[process.env.NEXT_PUBLIC_APPLICATIONS] &&
        applicationConfig[process.env.NEXT_PUBLIC_APPLICATIONS].layerOrder &&
        layers.length > 1
      ) {
        const { layerOrder } = applicationConfig[process.env.NEXT_PUBLIC_APPLICATIONS];
        layers = sortLayers(layers, layerOrder);
      }

      if (toggle) {
        layerGroups.unshift({
          dataset: dataset.id,
          visibility: true,
          layers: layers.map((l) => ({ ...l, active: l.default })),
        });
      } else {
        const index = layerGroups.findIndex((l) => l.dataset === dataset.id);
        layerGroups.splice(index, 1);
      }

      return {
        ...state,
        layerGroups,
      };
    },
    setMapLayerGroupVisibility: (state, { payload }) => {
      const { dataset, visibility } = payload;
      const layerGroups = state.layerGroups.map((lg) => {
        if (lg.id !== dataset.id) return lg;
        const updatedLayers = lg.layers.map((l) => ({
          ...l,
          layerConfig: { ...l.layerConfig, visibility },
        }));
        return {
          ...lg,
          layers: updatedLayers,
          visibility,
        };
      });

      return {
        ...state,
        layerGroups,
      };
    },
    setMapLayerGroupOpacity: (state, { payload }) => {
      const { dataset, opacity } = payload;
      const layerGroups = state.layerGroups.map((lg) => {
        if (lg.id !== dataset.id) return lg;
        const layers = lg.layers.map((l) => ({ ...l, layerConfig: { ...l.layerConfig, opacity } }));
        return {
          ...lg,
          layers,
          opacity,
        };
      });

      return {
        ...state,
        layerGroups,
      };
    },
    setMapLayerGroupActive: (state, { payload }) => {
      const { dataset, active } = payload;
      const layerGroups = state.layerGroups.map((lg) => {
        if (lg.id !== dataset.id) return lg;

        return {
          ...lg,
          layers: lg.layers.map((_layer) => ({
            ..._layer,
            active: _layer.id === active,
          })),
        };
      });

      return {
        ...state,
        layerGroups,
      };
    },
    setMapLayerGroupsOrder: (state, { payload }) => {
      const { datasetIds } = payload;
      const layerGroups = [...state.layerGroups];

      // Sort by new order
      layerGroups.sort((a, b) =>
        datasetIds.indexOf(a.dataset) > datasetIds.indexOf(b.dataset) ? 1 : -1,
      );

      return {
        ...state,
        layerGroups,
      };
    },
    setMapLayerParametrization: (state, { payload }) => {
      const { id, nextConfig } = payload;
      const { map } = state;
      const { parametrization } = map;

      parametrization[id] = {
        ...parametrization[id],
        ...nextConfig,
      };

      return {
        ...state,
        parametrization: {
          ...parametrization,
        },
      };
    },
    removeLayerParametrization: (state, { payload }) => {
      const { map } = state;
      const { parametrization } = map;

      delete parametrization[payload];

      return {
        ...state,
        parametrization: {
          ...parametrization,
        },
      };
    },
    resetLayerParametrization: (state) => ({
      ...state,
      parametrization: {
        ...initialState.parametrization,
      },
    }),
    // layer interaction management
    setMapLayerGroupsInteraction: (state, { payload }) => ({
      ...state,
      layerGroupsInteraction: {
        ...state.layerGroupsInteraction,
        ...payload,
      },
    }),
    setMapLayerGroupsInteractionSelected: (state, { payload }) => ({
      ...state,
      layerGroupsInteractionSelected: payload,
    }),
    setMapLayerGroupsInteractionLatLng: (state, { payload }) => ({
      ...state,
      layerGroupsInteractionLatLng: payload,
    }),
    resetMapLayerGroupsInteraction: (state) => ({
      ...state,
      layerGroupsInteraction: initialState.layerGroupsInteraction,
      layerGroupsInteractionLatLng: initialState.layerGroupsInteractionLatLng,
      layerGroupsInteractionSelected: initialState.layerGroupsInteractionSelected,
    }),
  },
  initialState,
});

export default mapSlice;

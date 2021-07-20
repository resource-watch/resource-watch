import {
  useState,
  useCallback,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import { useDebouncedCallback } from 'use-debounce';

// hooks
import {
  useGeostore,
} from 'hooks/geostore';

// constants
import {
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

// services
import {
  fetchLayer,
} from 'services/layer';

// utils
import {
  getUserAreaLayer,
} from 'components/map/utils';
import {
  getLayerGroups,
} from 'utils/layers';
import {
  logEvent,
} from 'utils/analytics';

// components
import MiniExploreMap from 'components/mini-explore/map/component';

// reducers
import {
  initialState,
  mapSlice,
} from './reducer';

const {
  setViewport,
  setBasemap,
  setBounds,
  setBoundaries,
  setLabels,
  setMapLayerGroups,
  setMapLayerGroupOpacity,
  setMapLayerGroupVisibility,
  resetLayerParametrization,
  setMapLayerGroupActive,
  toggleMapLayerGroup,
  setMapLayerParametrization,
  removeLayerParametrization,
  setMapLayerGroupsOrder,
  setMapLayerGroupsInteractionLatLng,
  setMapLayerGroupsInteraction,
  setMapLayerGroupsInteractionSelected,
  resetMapLayerGroupsInteraction,
} = mapSlice.actions;

const miniExploreReducer = mapSlice.reducer;

export default function MiniExploreMapContainer({
  layerIds,
  areaOfInterest,
  params,
}) {
  const [mapState, dispatch] = useReducer(miniExploreReducer, initialState);
  const [layerModal, setLayerModal] = useState(null);

  const {
    viewport,
    bounds,
    basemapId,
    labelsId,
    boundaries,
    layerGroups,
    layerGroupsInteraction,
    layerGroupsInteractionSelected,
    layerGroupsInteractionLatLng,
  } = mapState;

  const [onChangeOpacity] = useDebouncedCallback((l, opacity) => {
    dispatch(setMapLayerGroupOpacity({ dataset: { id: l.dataset }, opacity }));
  }, 250);

  const onChangeVisibility = useCallback((l, visibility) => {
    dispatch(setMapLayerGroupVisibility({
      dataset: { id: l.dataset },
      visibility,
    }));
  }, [dispatch]);

  const onChangeLayer = useCallback((l) => {
    dispatch(resetLayerParametrization());

    dispatch(setMapLayerGroupActive({
      dataset: { id: l.dataset },
      active: l.id,
    }));

    logEvent('Mini Explore Map', 'Clicks Another Layer from Map Legend Tooltip',
      `${l.name} [${l.id}]`);
  }, [dispatch]);

  const onRemoveLayer = useCallback((l) => {
    dispatch(toggleMapLayerGroup({
      dataset: { id: l.dataset },
      toggle: false,
    }));

    removeLayerParametrization(l.id);
  }, [dispatch]);

  const onChangeOrder = useCallback((datasetIds) => {
    dispatch(setMapLayerGroupsOrder({ datasetIds }));
  }, [dispatch]);

  const onChangeLayerDate = useCallback((dates, layer) => {
    const { id, layerConfig: { decode_config: decodeConfig } } = layer;

    dispatch(setMapLayerParametrization({
      id,
      nextConfig: {
        ...decodeConfig && {
          decodeParams: {
            startDate: dates[0],
            endDate: dates[1],
          },
        },
        ...!decodeConfig && {
          params: {
            startDate: dates[0],
            endDate: dates[1],
          },
        },
      },
    }));
  }, [dispatch]);

  const onChangeLayerTimeLine = useCallback((l) => {
    dispatch(setMapLayerGroupActive({
      dataset: {
        id: l.dataset,
      },
      active: l.id,
    }));
    logEvent('Mini Explore Map', 'Clicks Another Layer from Map Legend Timeline',
      `${l.name} [${l.id}]`);
  }, [dispatch]);

  const onClickLayer = useCallback(({ features, lngLat }) => {
    let interactions = {};

    // if the user clicks on a zone where there is no data in any current layer
    // we will reset the current interaction of those layers to display "no data available" message
    if (!features.length) {
      interactions = Object.keys(layerGroupsInteraction).reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: {},
      }), {});
    } else {
      interactions = features.reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.layer.source]: { data: currentValue.properties },
      }), {});
    }

    dispatch(setMapLayerGroupsInteractionLatLng({
      longitude: lngLat[0],
      latitude: lngLat[1],
    }));

    dispatch(setMapLayerGroupsInteraction(interactions));

    return true;
  }, [layerGroupsInteraction, dispatch]);

  const onChangeInteractiveLayer = useCallback((selected) => {
    dispatch(setMapLayerGroupsInteractionSelected(selected));
  }, [dispatch]);

  const handleClosePopup = useCallback(() => {
    dispatch(resetMapLayerGroupsInteraction());
  }, [dispatch]);

  const [handleViewport] = useDebouncedCallback((_viewport) => {
    dispatch(setViewport(_viewport));
  }, 250);

  const handleBoundaries = useCallback((_boundaries) => {
    dispatch(setBoundaries(_boundaries));
  }, [dispatch]);

  const handleZoom = useCallback((zoom) => {
    dispatch(setViewport({
      zoom,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250,
    }));
  }, [dispatch]);

  const handleBasemap = useCallback((_basemap) => {
    const { id } = _basemap;
    dispatch(setBasemap(id));
  }, [dispatch]);

  const handleResetView = useCallback(() => {
    dispatch(setViewport({
      bearing: 0,
      pitch: 0,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250,
    }));
  }, [dispatch]);

  const handleLabels = useCallback(({ value }) => {
    dispatch(setLabels(value));
  }, [dispatch]);

  const handleMapCursor = useCallback(({ isHovering }) => {
    if (isHovering) return 'pointer';
    return 'grab';
  }, []);

  const onChangeInfo = useCallback((layer) => {
    setLayerModal(layer);
  }, []);

  useEffect(() => {
    const promises = layerIds.map((_layerId) => fetchLayer(_layerId));
    Promise.all(promises).then((layers) => {
      const layersWithParams = layers.map((_layer) => ({
        ..._layer,
        params,
      }));

      dispatch(setMapLayerGroups(getLayerGroups(layersWithParams)));
    });
  }, [layerIds, params]);

  const {
    data: geostore,
  } = useGeostore(
    areaOfInterest,
    {},
    {
      enabled: !!areaOfInterest,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (!geostore) return false;

    const {
      bbox,
    } = geostore;

    dispatch(setBounds({
      bbox,
      options: {
        padding: 50,
      },
    }));

    return true;
  }, [geostore, dispatch]);

  const activeLayers = useMemo(() => {
    let aoiLayer = null;
    if (geostore) {
      const {
        id,
        geojson,
      } = geostore;

      aoiLayer = getUserAreaLayer(
        {
          id,
          geojson,
        },
        USER_AREA_LAYER_TEMPLATES.explore,
      );

      aoiLayer = {
        ...aoiLayer,
        opacity: 1,
        visibility: true,
        isAreaOfInterest: true,
      };
    }

    const activeLayerGroups = layerGroups.filter(
      (lg) => lg.layers.length > 0,
    ).map((lg) => ({
      ...lg.layers.find((l) => l.active),
    }));

    return [
      ...(aoiLayer !== null) ? [aoiLayer] : [],
      ...activeLayerGroups,
    ];
  },
  [layerGroups, geostore]);

  const activeInteractiveLayers = useMemo(() => flatten(
    compact(activeLayers.map((_activeLayer) => {
      const { id, layerConfig, interactionConfig } = _activeLayer;
      if (isEmpty(layerConfig) || isEmpty(interactionConfig)) return null;

      const { body = {} } = layerConfig;
      const { vectorLayers } = body;

      if (vectorLayers) {
        return vectorLayers.map((l, i) => {
          const {
            id: vectorLayerId,
            type: vectorLayerType,
          } = l;
          return vectorLayerId || `${id}-${vectorLayerType}-${i}`;
        });
      }

      return null;
    })),
  ), [activeLayers]);

  return (
    <MiniExploreMap
      viewport={viewport}
      bounds={bounds}
      basemapId={basemapId}
      labelsId={labelsId}
      boundaries={boundaries}
      layerGroups={layerGroups}
      activeLayers={activeLayers}
      activeInteractiveLayers={activeInteractiveLayers}
      layerGroupsInteraction={layerGroupsInteraction}
      layerGroupsInteractionSelected={layerGroupsInteractionSelected}
      layerGroupsInteractionLatLng={layerGroupsInteractionLatLng}
      layerModal={layerModal}
      handleMapCursor={handleMapCursor}
      handleLabels={handleLabels}
      handleResetView={handleResetView}
      handleBasemap={handleBasemap}
      handleZoom={handleZoom}
      handleBoundaries={handleBoundaries}
      handleClosePopup={handleClosePopup}
      handleViewport={handleViewport}
      onChangeInteractiveLayer={onChangeInteractiveLayer}
      onClickLayer={onClickLayer}
      onChangeLayerTimeLine={onChangeLayerTimeLine}
      onChangeLayerDate={onChangeLayerDate}
      onChangeInfo={onChangeInfo}
      onChangeOrder={onChangeOrder}
      onRemoveLayer={onRemoveLayer}
      onChangeLayer={onChangeLayer}
      onChangeVisibility={onChangeVisibility}
      onChangeOpacity={onChangeOpacity}
    />
  );
}

MiniExploreMapContainer.defaultProps = {
  areaOfInterest: null,
  params: {},
};

MiniExploreMapContainer.propTypes = {
  layerIds: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  areaOfInterest: PropTypes.string,
  params: PropTypes.shape({}),
};

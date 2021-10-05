import {
  useState,
  useCallback,
  useReducer,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

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
  setMapLayerGroupsInteractionSelected,
  resetMapLayerGroupsInteraction,
} = mapSlice.actions;

const miniExploreReducer = mapSlice.reducer;

const mapKey = uuidv4();
const maskLayerId = uuidv4();
let hoverState = null;

export default function MiniExploreMapContainer({
  layerIds,
  mask,
  areaOfInterest,
  onClickLayer,
  params,
}) {
  const [mapState, dispatch] = useReducer(miniExploreReducer, initialState);
  const [layerModal, setLayerModal] = useState(null);
  const [minZoom, setMinZoom] = useState(null);
  const mapRef = useRef(null);

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

  const handleFitBoundsChange = useCallback((_viewport) => {
    const {
      zoom,
    } = _viewport;

    setMinZoom(zoom);
  }, []);

  const [handleHover] = useDebouncedCallback((evt) => {
    if (hoverState) {
      mapRef.current.setFeatureState(
        hoverState,
        {
          hover: false,
        },
      );
    }

    if (evt.features.length > 0) {
      const {
        source,
        sourceLayer,
        properties,
      } = evt.features[0];

      if (!properties.cartodb_id) return false;

      hoverState = {
        source,
        sourceLayer,
        id: properties.cartodb_id,
      };

      if (properties.cartodb_id) {
        mapRef.current.setFeatureState(
          hoverState,
          {
            hover: true,
          },
        );
      }
    }
    return true;
  }, 0);

  useEffect(() => {
    const promises = layerIds.map((_layerId) => fetchLayer(_layerId));
    Promise.all(promises).then((layers) => {
      const layersWithParams = layers.map((_layer) => ({
        ..._layer,
        params,
        // This a fix - perhaps temporary - for layers that are not default: true in the API
        // and shouldn't be because of visibility constraints in RW or other apps.
        // Otherwise, the layer manager throws an error and it doesn't work
        default: true,
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

    const customBbox = {
      // USA
      '73b01f180d24d194821a9fc83ad48b7e': [-191.425781, 9.622414, -65.566406, 71.856229],
      // RUS
      '8c15c2cae46439129549856f12e81fde': [-332.929688, 42.032974, -162.949219, 77.617709],
    };

    dispatch(setBounds({
      bbox: customBbox[geostore.id] || bbox,
      options: {
        padding: 50,
      },
    }));

    return true;
  }, [geostore, dispatch]);

  const activeLayers = useMemo(() => {
    let aoiLayer = null;
    let maskLayer = null;

    if (geostore) {
      const {
        id,
        geojson,
      } = geostore;

      aoiLayer = getUserAreaLayer(
        {
          id,
          geojson,
          minZoom,
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

    if (mask) {
      maskLayer = {
        id: maskLayerId,
        ...mask,
        params,
      };
    }

    const activeLayerGroups = layerGroups.filter(
      (lg) => lg.layers.length > 0,
    ).map((lg) => ({
      ...lg.layers.find((l) => l.active),
    }));

    return [
      ...(aoiLayer !== null) ? [aoiLayer] : [],
      ...(maskLayer !== null) ? [maskLayer] : [],
      ...activeLayerGroups,
    ];
  },
  [layerGroups, geostore, mask, params, minZoom]);

  const activeInteractiveLayers = useMemo(() => flatten(
    compact(activeLayers.map((_activeLayer) => {
      const { layerConfig } = _activeLayer;
      if (isEmpty(layerConfig)) return null;

      const { body = {} } = layerConfig;
      const { vectorLayers } = body;

      if (vectorLayers) {
        return vectorLayers.filter(({ id: vectorLayerId }) => Boolean(vectorLayerId))
          .map(({ id: vectorLayerId }) => vectorLayerId);
      }

      return null;
    })),
  ), [activeLayers]);

  const handleClickLayer = useCallback((stuff) => {
    if (onClickLayer) onClickLayer(stuff, mapRef.current);
  }, [mapRef, onClickLayer]);

  return (
    <MiniExploreMap
      // forces to render the component again and paint updated styles in the map.
      // This might be fixed in recent versions of Layer Manager.
      // todo: try to remove the key when the layer manager version is updated.
      key={minZoom || mapKey}
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
      onClickLayer={handleClickLayer}
      onChangeLayerTimeLine={onChangeLayerTimeLine}
      onChangeLayerDate={onChangeLayerDate}
      onChangeInfo={onChangeInfo}
      onChangeOrder={onChangeOrder}
      onRemoveLayer={onRemoveLayer}
      onChangeLayer={onChangeLayer}
      onChangeVisibility={onChangeVisibility}
      onChangeOpacity={onChangeOpacity}
      handleFitBoundsChange={handleFitBoundsChange}
      onHover={handleHover}
      onLoad={({ map }) => { mapRef.current = map; }}
    />
  );
}

MiniExploreMapContainer.defaultProps = {
  areaOfInterest: null,
  mask: null,
  params: {},
};

MiniExploreMapContainer.propTypes = {
  layerIds: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  areaOfInterest: PropTypes.string,
  mask: PropTypes.shape({}),
  params: PropTypes.shape({}),
  onClickLayer: PropTypes.func.isRequired,
};

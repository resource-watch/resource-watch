import {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import flattenDeep from 'lodash/flattenDeep';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

// hooks
import {
  useFetchDatasets,
} from 'hooks/dataset/fetch-datasets';
import {
  useGeostore,
} from 'hooks/geostore';

// constants
import {
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

// utils
import {
  getUserAreaLayer,
} from 'components/map/utils';
import {
  logEvent,
} from 'utils/analytics';

// components
import MiniExploreMap from './component';

// reducers
import {
  miniExploreSlice,
} from '../reducer';

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
} = miniExploreSlice.actions;

const mapKey = uuidv4();

export default function MiniExploreMapContainer({
  mapState: {
    viewport,
    bounds,
    basemapId,
    labelsId,
    boundaries,
    layerGroups,
    layerGroupsInteraction,
    layerGroupsInteractionSelected,
    layerGroupsInteractionLatLng,
  },
  datasetGroups,
  areaOfInterest,
  forcedBbox,
  dispatch,
}) {
  const [layerModal, setLayerModal] = useState(null);
  const [minZoom, setMinZoom] = useState(null);
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

  const handleFitBoundsChange = useCallback((_viewport) => {
    const {
      zoom,
    } = _viewport;

    setMinZoom(zoom);
  }, []);

  // returns an array of dataset IDs through the different dataset groups
  const datasetIds = useMemo(() => flattenDeep(
    datasetGroups.map(({ datasets: _datasets }) => _datasets),
  ), [datasetGroups]);

  // returns an array of dataset IDs should be displayed the different dataset groups
  const defaultDatasets = useMemo(() => compact(flattenDeep(
    datasetGroups.map(({ default: _default }) => _default),
  )), [datasetGroups]);

  const {
    data: datasetsWithLayers,
  } = useFetchDatasets({
    includes: 'layer',
    ids: datasetIds.join(','),
    'page[size]': 30,
  }, {
    enabled: !!(datasetIds.length),
    refetchOnWindowFocus: false,
    placeholderData: [],
  });

  useEffect(() => {
    const defaultDatasetsWithLayers = datasetsWithLayers.filter(
      ({ id }) => defaultDatasets.includes(id),
    );
    dispatch(setMapLayerGroups({
      datasets: defaultDatasetsWithLayers,
    }));
  }, [dispatch, datasetsWithLayers, defaultDatasets]);

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
    if (!geostore && !forcedBbox) return false;

    if (geostore && !forcedBbox) {
      const {
        bbox,
      } = geostore;

      dispatch(setBounds({
        bbox,
        options: {
          padding: 50,
        },
      }));
    }

    if (forcedBbox) {
      dispatch(setBounds({
        bbox: forcedBbox,
        options: {
          padding: 50,
        },
      }));
    }

    return true;
  }, [geostore, dispatch, forcedBbox]);

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
  [layerGroups, geostore, minZoom]);

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
      handleFitBoundsChange={handleFitBoundsChange}
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
  forcedBbox: null,
};

MiniExploreMapContainer.propTypes = {
  mapState: PropTypes.shape({
    viewport: PropTypes.shape({}).isRequired,
    bounds: PropTypes.shape({
      bbox: PropTypes.arrayOf(PropTypes.number),
      options: PropTypes.shape({
        padding: PropTypes.number,
      }),
    }).isRequired,
    boundaries: PropTypes.bool.isRequired,
    basemapId: PropTypes.string.isRequired,
    labelsId: PropTypes.string.isRequired,
    layerGroups: PropTypes.arrayOf(
      PropTypes.shape({}),
    ).isRequired,
    layerGroupsInteraction: PropTypes.shape({}).isRequired,
    layerGroupsInteractionSelected: PropTypes.string,
    layerGroupsInteractionLatLng: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  datasetGroups: PropTypes.arrayOf(
    PropTypes.shape({}).isRequired,
  ).isRequired,
  areaOfInterest: PropTypes.string,
  forcedBbox: PropTypes.arrayOf(
    PropTypes.number,
  ),
};

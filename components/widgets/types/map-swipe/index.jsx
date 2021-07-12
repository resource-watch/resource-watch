import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  useQueries,
} from 'react-query';
import {
  ErrorBoundary,
} from 'react-error-boundary';

// services
import {
  fetchLayer,
} from 'services/layer';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import {
  useGeostore,
} from 'hooks/geostore';
import {
  useMe,
} from 'hooks/user';

// constants
import {
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

// utils
import {
  getUserAreaLayer,
  parseBbox,
} from 'components/map/utils';
import {
  getLayerGroups,
} from 'utils/layers';

// components
import ErrorFallback from 'components/error-fallback';
import SwipeTypeWidget from './component';

const CustomErrorFallback = ((_props) => (
  <ErrorFallback
    {..._props}
    title="Something went wrong loading the widget"
  />
));

export default function SwipeTypeWidgetContainer({
  widgetId,
  areaOfInterest,
  onToggleShare,
}) {
  const {
    data: user,
  } = useMe();
  const {
    isInACollection,
  } = useBelongsToCollection(widgetId, user?.token);

  const {
    data: widget,
    isFetching,
    isError: isErrorWidget,
    refetch: refetchWidget,
  } = useFetchWidget(
    widgetId,
    {
      includes: 'metadata',
    },
    {
      enabled: !!widgetId,
      refetchOnWindowFocus: false,
      placeholderData: {},
    },
  );

  const {
    data: geostore,
    isError: isErrorGeostore,
    refetch: refetchGeostore,
  } = useGeostore(
    areaOfInterest,
    {},
    {
      enabled: !!areaOfInterest,
      refetchOnWindowFocus: false,
    },
  );

  const leftLayerStates = useQueries(
    (widget?.widgetConfig?.paramsConfig?.layersLeft || []).map((layerId) => ({
      queryKey: ['fetch-layer', layerId],
      queryFn: () => fetchLayer(layerId),
      placeholderData: null,
    })),
  );

  const rightLayerStates = useQueries(
    (widget?.widgetConfig?.paramsConfig?.layersRight || []).map((layerId) => ({
      queryKey: ['fetch-layer', layerId],
      queryFn: () => fetchLayer(layerId),
      placeholderData: null,
    })),
  );

  const layers = useMemo(() => ({
    left: leftLayerStates
      .filter(({ data }) => !!data)
      .map(({ data }) => data),
    right: rightLayerStates
      .filter(({ data }) => !!data)
      .map(({ data }) => data),
  }), [leftLayerStates, rightLayerStates]);

  const aoiLayer = useMemo(() => {
    const { layerParams } = widget?.widgetConfig || {};

    if (!geostore) return null;

    const {
      id,
      geojson,
      bbox,
    } = geostore;

    return ({
      ...getUserAreaLayer(
        {
          id,
          geojson,
        },
        USER_AREA_LAYER_TEMPLATES.explore,
      ),
      opacity: layerParams?.aoi?.opacity || 1,
      visibility: true,
      isAreaOfInterest: true,
      bbox,
    });
  },
  [geostore, widget]);

  const layerGroupsBySide = useMemo(() => {
    const { layerParams } = widget?.widgetConfig?.paramsConfig || {};

    return ({
      left: getLayerGroups(layers.left, layerParams),
      right: getLayerGroups(layers.right, layerParams),
    });
  }, [layers, widget]);

  const bounds = useMemo(() => {
    if (aoiLayer?.bbox) {
      return ({
        bbox: aoiLayer.bbox,
        options: {
          padding: 50,
        },
      });
    }

    if (!widget?.widgetConfig?.bbox) return ({});

    return ({
      bbox: parseBbox(widget.widgetConfig.bbox),
    });
  }, [aoiLayer, widget]);

  const isError = useMemo(
    () => (isErrorWidget || isErrorGeostore),
    [isErrorWidget, isErrorGeostore],
  );

  return (
    <ErrorBoundary
      FallbackComponent={CustomErrorFallback}
      onReset={() => {
        refetchWidget();
        refetchGeostore();
      }}
    >
      <SwipeTypeWidget
        layerGroupsBySide={layerGroupsBySide}
        aoiLayer={aoiLayer}
        bounds={bounds}
        widget={widget}
        isFetching={isFetching}
        isError={isError}
        isInACollection={isInACollection}
        onToggleShare={onToggleShare}
      />
    </ErrorBoundary>
  );
}

SwipeTypeWidgetContainer.defaultProps = {
  areaOfInterest: null,
};

SwipeTypeWidgetContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  areaOfInterest: PropTypes.string,
  onToggleShare: PropTypes.func.isRequired,
};

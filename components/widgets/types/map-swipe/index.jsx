import {
  useMemo,
  useState,
  useCallback,
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

// utils
import {
  parseBbox,
} from 'components/map/utils';
import {
  getAoiLayer,
  getMaskLayer,
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
  params,
  areaOfInterest,
  onToggleShare,
}) {
  const [minZoom, setMinZoom] = useState(null);
  const {
    data: user,
  } = useMe();
  const {
    isInACollection,
  } = useBelongsToCollection(widgetId, user?.token);

  const onFitBoundsChange = useCallback((viewport) => {
    const {
      zoom,
    } = viewport;

    setMinZoom(zoom);
  }, []);

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
      select: (_layer) => ({
        ..._layer,
        params,
      }),
    })),
  );

  const rightLayerStates = useQueries(
    (widget?.widgetConfig?.paramsConfig?.layersRight || []).map((layerId) => ({
      queryKey: ['fetch-layer', layerId],
      queryFn: () => fetchLayer(layerId),
      placeholderData: null,
      select: (_layer) => ({
        ..._layer,
        params,
      }),
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

  const aoiLayer = useMemo(
    () => getAoiLayer(widget, geostore, { minZoom }),
    [geostore, widget, minZoom],
  );

  const maskLayer = useMemo(() => getMaskLayer(widget, params), [widget, params]);

  const layerGroupsBySide = useMemo(() => {
    const { layerParams } = widget?.widgetConfig?.paramsConfig || {};

    return ({
      left: getLayerGroups(layers.left, layerParams),
      right: getLayerGroups(layers.right, layerParams),
    });
  }, [layers, widget]);

  const bounds = useMemo(() => {
    if (geostore?.bbox) {
      return ({
        bbox: geostore.bbox,
        options: {
          padding: 50,
        },
      });
    }

    if (!widget?.widgetConfig?.bbox) return ({});

    return ({
      bbox: parseBbox(widget.widgetConfig.bbox),
    });
  }, [geostore, widget]);

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
        maskLayer={maskLayer}
        bounds={bounds}
        widget={widget}
        isFetching={isFetching}
        isError={isError}
        isInACollection={isInACollection}
        onToggleShare={onToggleShare}
        onFitBoundsChange={onFitBoundsChange}
      />
    </ErrorBoundary>
  );
}

SwipeTypeWidgetContainer.defaultProps = {
  areaOfInterest: null,
  params: null,
};

SwipeTypeWidgetContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
  areaOfInterest: PropTypes.string,
  onToggleShare: PropTypes.func.isRequired,
};

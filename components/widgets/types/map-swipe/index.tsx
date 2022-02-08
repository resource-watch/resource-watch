import { useMemo, useState, useCallback, CSSProperties } from 'react';
import { useQueries } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import type { ViewportProps } from 'react-map-gl';

// services
import { fetchLayer } from 'services/layer';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import { useGeostore } from 'hooks/geostore';
import { useMe } from 'hooks/user';

// utils
import { getAoiLayer, getMaskLayer, getLayerGroups } from 'utils/layers';
import { getParametrizedWidget } from 'utils/widget';

// components
import ErrorFallback from 'components/error-fallback';
import SwipeTypeWidget from './component';

import type { Bounds } from 'components/map/types';
import type { APIWidgetSpec } from 'types/widget';

const CustomErrorFallback = (_props) => (
  <ErrorFallback {..._props} title="Something went wrong loading the widget" />
);

export interface SwipeTypeWidgetContainerProps {
  widgetId: string;
  params?: Record<string, string | number>;
  style?: CSSProperties;
  isEmbed?: boolean;
  isWebshot?: boolean;
  areaOfInterest?: string;
  onToggleShare: (widget: APIWidgetSpec) => void;
}

const SwipeTypeWidgetContainer = ({
  widgetId,
  params = {},
  style = {},
  isEmbed = false,
  isWebshot = false,
  areaOfInterest = null,
  onToggleShare,
}: SwipeTypeWidgetContainerProps): JSX.Element => {
  const [minZoom, setMinZoom] = useState<number>(null);
  const { data: user } = useMe();
  const { isInACollection } = useBelongsToCollection(widgetId, user?.token);

  const onFitBoundsChange = useCallback((viewport: ViewportProps) => {
    const { zoom } = viewport;

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
      select: (_widget) => getParametrizedWidget(_widget as APIWidgetSpec, params, false),
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

  const layers = useMemo(
    () => ({
      left: leftLayerStates.filter(({ data }) => !!data && data?.id).map(({ data }) => data),
      right: rightLayerStates.filter(({ data }) => !!data && data?.id).map(({ data }) => data),
    }),
    [leftLayerStates, rightLayerStates],
  );

  const aoiLayer = useMemo(
    () => getAoiLayer(widget, geostore, { minZoom }),
    [geostore, widget, minZoom],
  );

  const maskLayer = useMemo(() => getMaskLayer(widget, params), [widget, params]);

  const layerGroupsBySide = useMemo(() => {
    const { layerParams } = widget?.widgetConfig?.paramsConfig || {};

    return {
      left: getLayerGroups(layers.left, layerParams, true),
      right: getLayerGroups(layers.right, layerParams, true),
    };
  }, [layers, widget]);

  const bounds: Bounds | null = useMemo(() => {
    if (geostore?.bbox)
      return {
        bbox: geostore.bbox,
        options: {
          padding: 50,
        },
      } as Bounds;

    if (!widget?.widgetConfig?.bounds) return null;

    return {
      bbox: widget.widgetConfig.bbox,
    } as Bounds;
  }, [widget, geostore]);

  const isError = useMemo(() => isErrorWidget || isErrorGeostore, [isErrorWidget, isErrorGeostore]);

  // * these params are used to make a shareable URL. See more details about which ones are accepted in utils/embed
  const shareableParams = useMemo(
    () => ({
      ...params,
      ...(params.geostore_id && {
        aoi: params.geostore_id,
      }),
    }),
    [params],
  );

  return (
    <ErrorBoundary
      FallbackComponent={CustomErrorFallback}
      onReset={() => {
        refetchWidget();
        if (areaOfInterest) refetchGeostore();
      }}
    >
      <SwipeTypeWidget
        layerGroupsBySide={layerGroupsBySide}
        aoiLayer={aoiLayer}
        maskLayer={maskLayer}
        bounds={bounds}
        widget={widget as APIWidgetSpec}
        params={shareableParams}
        style={style}
        isEmbed={isEmbed}
        isWebshot={isWebshot}
        isFetching={isFetching}
        isError={isError}
        isInACollection={isInACollection}
        onToggleShare={onToggleShare}
        onFitBoundsChange={onFitBoundsChange}
      />
    </ErrorBoundary>
  );
};

export default SwipeTypeWidgetContainer;

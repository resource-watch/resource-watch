import {
  useMemo,
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  useQueries,
} from 'react-query';
import {
  ErrorBoundary,
} from 'react-error-boundary';
import { v4 as uuidv4 } from 'uuid';

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
  getAoiLayer,
  getMaskLayer,
  getLayerGroups,
} from 'utils/layers';

// components
import ErrorFallback from 'components/error-fallback';
import MapTypeWidget from './component';

const mapKey = uuidv4();

const CustomErrorFallback = ((_props) => (
  <ErrorFallback
    {..._props}
    title="Something went wrong loading the widget"
  />
));

export default function MapTypeWidgetContainer({
  widgetId,
  params,
  style,
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

  const layerIds = useMemo(() => {
    if (widget?.widgetConfig?.paramsConfig?.layers) return widget.widgetConfig.paramsConfig.layers;
    if (widget?.widgetConfig?.paramsConfig?.layer) return [widget.widgetConfig.paramsConfig.layer];
    return [];
  }, [widget]);

  const layerStates = useQueries(
    layerIds.map((layerId) => ({
      queryKey: ['fetch-layer', layerId],
      queryFn: () => fetchLayer(layerId),
      placeholderData: null,
      select: (_layer) => (_layer ? ({
        ..._layer,
        params,
      }) : null),
    })),
  );

  const layers = useMemo(() => layerStates
    .filter(({ data }) => !!data)
    .map(({ data }) => data),
  [layerStates]);

  const onFitBoundsChange = useCallback((viewport) => {
    const {
      zoom,
    } = viewport;

    setMinZoom(zoom);
  }, []);

  const aoiLayer = useMemo(
    () => getAoiLayer(widget, geostore, { minZoom }), [geostore, widget, minZoom],
  );

  const maskLayer = useMemo(() => getMaskLayer(widget, params), [widget, params]);

  const layerGroups = useMemo(() => {
    const { layerParams } = widget?.widgetConfig?.paramsConfig || {};
    return getLayerGroups(layers, layerParams);
  }, [layers, widget]);

  const isError = useMemo(
    () => (isErrorWidget || isErrorGeostore),
    [isErrorWidget, isErrorGeostore],
  );

  return (
    <ErrorBoundary
      FallbackComponent={CustomErrorFallback}
      onReset={() => {
        refetchWidget();
        if (areaOfInterest) refetchGeostore();
      }}
    >
      <MapTypeWidget
        // forces to render the component again and paint updated styles in the map.
        // This might be fixed in recent versions of Layer Manager.
        // todo: try to remove the key when the layer manager version is updated.
        key={minZoom || mapKey}
        layerGroups={layerGroups}
        {...geostore?.bbox && {
          mapBounds: {
            bbox: geostore.bbox,
            options: {
              padding: 50,
            },
          },
        }}
        aoiLayer={aoiLayer}
        maskLayer={maskLayer}
        widget={widget}
        style={style}
        isFetching={isFetching}
        isError={isError}
        isInACollection={isInACollection}
        onToggleShare={onToggleShare}
        onFitBoundsChange={onFitBoundsChange}
      />
    </ErrorBoundary>
  );
}

MapTypeWidgetContainer.defaultProps = {
  areaOfInterest: null,
  params: {},
  style: {},
};

MapTypeWidgetContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
  style: PropTypes.shape({}),
  areaOfInterest: PropTypes.string,
  onToggleShare: PropTypes.func.isRequired,
};

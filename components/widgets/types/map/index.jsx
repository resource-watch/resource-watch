import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  useQueries,
} from 'react-query';
import {
  useSelector,
} from 'react-redux';
import groupBy from 'lodash/groupBy';
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

// constants
import {
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

// utils
import {
  getUserAreaLayer,
} from 'components/map/utils';

// components
import ErrorFallback from 'components/error-fallback';
import MapTypeWidget from './component';

const CustomErrorFallback = ((_props) => (
  <ErrorFallback
    {..._props}
    title="Something went wrong loading the widget"
  />
));

export default function MapTypeWidgetContainer({
  widgetId,
  areaOfInterest,
  onToggleShare,
}) {
  const userToken = useSelector((state) => state.user?.token);
  const {
    isInACollection,
  } = useBelongsToCollection(widgetId, userToken);

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
    })),
  );

  const layers = useMemo(() => layerStates
    .filter(({ data }) => !!data)
    .map(({ data }) => data),
  [layerStates]);

  const aoiLayer = useMemo(() => {
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
      opacity: 1,
      visibility: true,
      isAreaOfInterest: true,
      bbox,
    });
  },
  [geostore]);

  const layerGroups = useMemo(() => {
    const layersByDataset = groupBy(layers, 'dataset');

    return Object.keys(layersByDataset).map((datasetKey) => ({
      id: datasetKey,
      opacity: 1,
      visibility: true,
      layers: layersByDataset[datasetKey]
        .map((_layer) => ({
          ..._layer,
          active: _layer.default,
          opacity: 1,
        })),
    }));
  }, [layers]);

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
      <MapTypeWidget
        layerGroups={layerGroups}
        aoiLayer={aoiLayer}
        widget={widget}
        isFetching={isFetching}
        isError={isError}
        isInACollection={isInACollection}
        onToggleShare={onToggleShare}
      />
    </ErrorBoundary>
  );
}

MapTypeWidgetContainer.defaultProps = {
  areaOfInterest: null,
};

MapTypeWidgetContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  areaOfInterest: PropTypes.string,
  onToggleShare: PropTypes.func.isRequired,
};

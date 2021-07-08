import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  useQueries,
} from 'react-query';
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
} from 'components/map/utils';
import {
  getTilerUrl,
  getParametrizedMapWidget,
} from 'utils/layers';

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
  widgetParams,
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
      select: (_widget) => getParametrizedMapWidget(_widget, widgetParams),
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

  const maskLayer = useMemo(() => {
    const { mask } = widget?.widgetConfig?.paramsConfig || {};
    const { layerParams } = widget?.widgetConfig?.paramsConfig || {};

    if (!mask) return null;

    // console.log('mask', mask)
    // return ({
    //   account: 'wri-rw',
    //   body: {
    //     layers: [
    //       {
    //         type: 'mapnik',
    //         options: {
    //           sql: "SELECT cartodb_id, the_geom_webmercator, st_intersects(the_geom, (select the_geom from gadm36_0 where geostore_staging = '804b97bc661ae04c2b899d71ecaeb858' )) as intersect FROM wri-rw.wat_068_rw0_watersheds_edit WHERE level = 3",
    //         },
    //       },
    //     ],
    //     vectorLayers: [
    //       {
    //         paint: {
    //           'fill-color': '#000',
    //           'fill-opacity': 0,
    //         },
    //         'source-layer': 'layer0',
    //         type: 'fill',
    //       },
    //       {
    //         paint: {
    //           'line-color': '#0079B0',
    //           'line-opacity': 1,
    //           'line-width': 1,
    //         },
    //         'source-layer': 'layer0',
    //         type: 'line',
    //       },
    //     ],
    //     layerType: 'vector',
    //   },
    // });

    return ({
      id: 'mask',
      provider: 'cartodb',
      layerConfig: {
        parse: false,
        account: 'wri-rw',
        body: {
          layers: [
            {
              type: 'mapnik',
              options: {
                sql: `with table1 as (SELECT cartodb_id, the_geom_webmercator, st_intersects(the_geom, (select the_geom from gadm36_0 where geostore_staging = '08071a69b43cd5cc16dc2c6aedda966e' )) as intersect FROM wat_068_rw0_watersheds_edit WHERE level = 3)
                select * from table1 where table1.intersect is true`,
              },
            },
          ],
          vectorLayers: [
            {
              paint: {
                'fill-color': '#000',
                'fill-opacity': 0,
              },
              'source-layer': 'layer0',
              type: 'fill',
            },
            {
              paint: {
                'line-color': '#f00',
                'line-opacity': 1,
                'line-width': 1,
              },
              'source-layer': 'layer0',
              type: 'line',
            },
          ],
          layerType: 'vector',
        },
      },
      opacity: layerParams?.mask?.opacity || 1,
      visibility: true,
      isMask: true,
    });
  }, [widget]);

  const layerGroups = useMemo(() => {
    const layersByDataset = groupBy(layers, 'dataset');
    const { layerParams } = widget?.widgetConfig?.paramsConfig || {};

    return Object.keys(layersByDataset).map((datasetKey) => ({
      id: datasetKey,
      visibility: true,
      layers: layersByDataset[datasetKey]
        .map((_layer) => ({
          ..._layer,
          active: _layer.default,
          opacity: layerParams?.[_layer.id]?.opacity || 1,
          ..._layer.layerConfig.type === 'gee' && {
            layerConfig: {
              ..._layer.layerConfig,
              body: {
                ..._layer.layerConfig.body,
                url: getTilerUrl(_layer),
              },
            },
          },
        })),
    }));
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
        refetchGeostore();
      }}
    >
      <MapTypeWidget
        layerGroups={layerGroups}
        aoiLayer={aoiLayer}
        maskLayer={maskLayer}
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
  widgetParams: null,
};

MapTypeWidgetContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  widgetParams: PropTypes.shape({}),
  areaOfInterest: PropTypes.string,
  onToggleShare: PropTypes.func.isRequired,
};

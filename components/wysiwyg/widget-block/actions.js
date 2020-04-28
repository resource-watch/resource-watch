import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// services
import { fetchWidget } from 'services/widget';
import { fetchLayer } from 'services/layer';

// utils
import { reduceParams, reduceSqlParams } from 'utils/layers/params-parser';

// Widget actions
export const setWidget = createAction('WIDGET_BLOCK_GET');
export const setWidgetLoading = createAction('WIDGET_BLOCK_LOADING');
export const setWidgetError = createAction('WIDGET_BLOCK_ERROR');
export const setWidgetType = createAction('WIDGET_BLOCK_TYPE');
export const setWidgetModal = createAction('WIDGET_BLOCK_MODAL');
export const removeWidget = createAction('WIDGET_BLOCK_REMOVE');

// Layer actions
export const setLayers = createAction('WIDGET_BLOCK_LAYERS_GET');
export const setLayersLoading = createAction('WIDGET_BLOCK_LAYERS_LOADING');
export const setLayersError = createAction('WIDGET_BLOCK_LAYERS_ERROR');

// Favourite actions
export const setFavourite = createAction('WIDGET_BLOCK_FAVOURITE_GET');
export const setFavouriteLoading = createAction('WIDGET_BLOCK_FAVOURITE_LOADING');
export const setFavouriteError = createAction('WIDGET_BLOCK_FAVOURITE_ERROR');

export const getLayer = createThunkAction('WIDGET_BLOCK_LAYERS_FETCH_DATA', (payload = {}) => (dispatch) => {
  const {
    id,
    widget
  } = payload;
  const { widgetConfig: { layer_id: layerId } } = widget;

  dispatch(setLayersLoading({ id, value: true }));
  dispatch(setLayersError({ id, value: null }));

  fetchLayer(layerId, { application: process.env.APPLICATIONS })
    .then((layer) => {
      dispatch(setLayersLoading({ id, value: false }));
      dispatch(setLayersError({ id, value: null }));

      const reducedDecodeParams = reduceParams(layer.layerConfig.decode_config);
      const { startDate, endDate } = reducedDecodeParams || {};

      const parsedLayer = {
        ...layer,
        ...layer.layerConfig.layerType && { layerType: layer.layerConfig.layerType },
        ...layer.layerConfig.params_config && {
          params: {
            ...reduceParams(layer.layerConfig.params_config),
            ...!!layer.layerConfig.body.url && { url: layer.layerConfig.body.url }
          }
        },
        ...layer.layerConfig.sql_config &&
        { sqlParams: reduceSqlParams(layer.layerConfig.sql_config) },
        ...layer.layerConfig.decode_config && {
          decodeParams: {
            ...reducedDecodeParams,
            ...(startDate && {
              startYear: moment(startDate).year(),
              startMonth: moment(startDate).month(),
              startDay: moment(startDate).dayOfYear()
            }),
            ...(endDate && {
              endYear: moment(endDate).year(),
              endMonth: moment(endDate).month(),
              endDay: moment(endDate).dayOfYear()
            })
          }
        }
      };

      dispatch(setLayers({
        id,
        value: [{
          dataset: layer.dataset,
          visible: true,
          layers: [{
            active: true,
            id: layer.id,
            ...parsedLayer
          }]
        }]
      }));


    })
    .catch((err) => {
      dispatch(setLayersLoading({ id, value: false }));
      dispatch(setLayersError({ id, value: err.message }));
    });
});

export const getWidget = createThunkAction('WIDGET_BLOCK_FETCH_DATA', (payload = {}) => (dispatch) => {
  const id = `${payload.id}/${payload.itemId}`;

  dispatch(setWidgetLoading({ id, value: true }));
  dispatch(setWidgetError({ id, value: null }));

  const { id: widgetId, includes } = payload;
  fetchWidget(widgetId, {
    includes,
    application: process.env.APPLICATIONS
  })
    .then((widget) => {
      const { widgetConfig } = widget;

      dispatch(setWidgetLoading({ id, value: false }));
      dispatch(setWidgetError({ id, value: null }));
      dispatch(setWidgetType({ id, value: (widgetConfig && widgetConfig.type) || 'widget' }));
      dispatch(setWidget({ id, value: widget }));

      if (widgetConfig.type && widgetConfig.type === 'map') {
        dispatch(getLayer({ id, widget }));
      }
    })
    .catch((err) => {
      dispatch(setWidgetLoading({ id, value: false }));
      dispatch(setWidgetError({ id, value: err.message }));
    });
});

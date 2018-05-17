import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

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

// Async actions
export const fetchLayers = createThunkAction('WIDGET_BLOCK_LAYERS_FETCH_DATA', (payload = {}) => (dispatch) => {
  const { id } = payload;

  dispatch(setLayersLoading({ id, value: true }));
  dispatch(setLayersError({ id, value: null }));

  fetch(`${process.env.WRI_API_URL}/layer/${payload.widget.widgetConfig.layer_id}?&application=${process.env.APPLICATIONS}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(({ data }) => {
      dispatch(setLayersLoading({ id, value: false }));
      dispatch(setLayersError({ id, value: null }));
      dispatch(setLayers({
        id,
        value: [{
          dataset: data.attributes.dataset,
          visible: true,
          layers: [{
            active: true,
            id: data.id,
            ...data.attributes
          }]
        }]
      }));
    })
    .catch((err) => {
      dispatch(setLayersLoading({ id, value: false }));
      dispatch(setLayersError({ id, value: err }));
    });
});

export const fetchWidget = createThunkAction('WIDGET_BLOCK_FETCH_DATA', (payload = {}) => (dispatch) => {
  const id = `${payload.id}/${payload.itemId}`;

  dispatch(setWidgetLoading({ id, value: true }));
  dispatch(setWidgetError({ id, value: null }));

  fetch(`${process.env.WRI_API_URL}/widget/${payload.id}?&application=${process.env.APPLICATIONS}&includes=${payload.includes}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(({ data }) => {
      const widget = { id: data.id, ...data.attributes };
      const { widgetConfig } = widget;

      dispatch(setWidgetLoading({ id, value: false }));
      dispatch(setWidgetError({ id, value: null }));
      dispatch(setWidgetType({ id, value: (widgetConfig && widgetConfig.type) || 'vega' }));
      dispatch(setWidget({ id, value: widget }));

      if (widgetConfig.type && widgetConfig.type === 'map') {
        dispatch(fetchLayers({ id, widget }));
      }
    })
    .catch((err) => {
      dispatch(setWidgetLoading({ id, value: false }));
      dispatch(setWidgetError({ id, value: err }));
    });
});

import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setWidget = createAction('WIDGET-DETAIL/setWidget');
export const setWidgetLoading = createAction('WIDGET-DETAIL/setWidgetLoading');
export const setWidgetError = createAction('WIDGET-DETAIL/setWidgetError');

// Async actions
export const fetchWidget = createThunkAction('WIDGET-DETAIL/fetchWidget', (payload = {}) => (dispatch) => {
  dispatch(setWidgetLoading(true));
  dispatch(setWidgetError(null));

  return fetch(new Request(`${process.env.WRI_API_URL}/widget/${payload.id}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(({ data }) => {
      dispatch(setWidgetLoading(false));
      dispatch(setWidgetError(null));
      dispatch(setWidget({ id: data.id, ...data.attributes }));
    })
    .catch((err) => {
      dispatch(setWidgetLoading(false));
      dispatch(setWidgetError(err));
    });
});

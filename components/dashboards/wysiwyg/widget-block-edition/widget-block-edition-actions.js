import { createAction, createThunkAction } from 'redux-actions';

// Services
import WidgetsService from 'services/WidgetsService';

const WIDGET_SERVICE = new WidgetsService();

export const setWidgets = createAction('WIDGET_BLOCK_EDITION_WIDGETS');
export const setWidgetsCollections = createAction('WIDGET_BLOCK_EDITION_WIDGETS_COLLECTIONS');
export const setLoading = createAction('WIDGET_BLOCK_EDITION_LOADING');
export const setError = createAction('WIDGET_BLOCK_EDITION_ERROR');

export const fetchData = createThunkAction('WIDGET_BLOCK_EDITION_FETCH_DATA', (/* payload */) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  const promises = [
    WIDGET_SERVICE.fetchAllData({ includes: 'widget' })
  ];

  Promise.all(promises)
    .then((response) => {
      dispatch(setLoading(false));
      dispatch(setError(null));

      dispatch(setWidgets(response[0]));
      dispatch(setWidgetsCollections(response[1]));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});

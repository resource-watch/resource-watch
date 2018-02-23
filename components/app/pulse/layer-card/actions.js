import { createAction, createThunkAction } from 'redux-tools';

// Services
import WidgetService from 'services/WidgetService';
import DatasetService from 'services/DatasetService';

export const setDatasetData = createAction('layer-card/setDatasetData');
export const setWidget = createAction('layer-card/setWidget');

export const loadDatasetData = createThunkAction('layer-card/loadDatasetData', ({ id, locale = 'en' }) =>
  (dispatch) => {
    if (id) {
      const datasetService = new DatasetService(id, {
        apiURL: process.env.WRI_API_URL,
        language: locale
      });

      datasetService.fetchData().then((data) => {
        dispatch(setDatasetData(data));
      });
    }
  });

export const loadWidgetData = createThunkAction('layer-card/loadWidgetData', id =>
  (dispatch) => {
    if (id) {
      const widgetService = new WidgetService(id, { apiURL: process.env.WRI_API_URL });
      widgetService.fetchData().then(response =>
        dispatch(setWidget(response)));
    }
  });

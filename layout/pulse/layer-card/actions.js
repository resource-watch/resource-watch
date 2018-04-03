import { createAction, createThunkAction } from 'redux-tools';

// Services
import WidgetService from 'services/WidgetService';
import DatasetService from 'services/DatasetService';

export const setDatasetData = createAction('layer-card/setDatasetData');
export const setWidget = createAction('layer-card/setWidget');

export const loadDatasetData = createThunkAction('layer-card/loadDatasetData', params =>
  (dispatch) => {
    if (params && params.id) {
      const datasetService = new DatasetService(params.id, {
        apiURL: process.env.WRI_API_URL,
        language: params.locale || 'en'
      });

      datasetService.fetchData().then((data) => {
        dispatch(setDatasetData(data));
      });
    } else {
      dispatch(setDatasetData(null));
    }
  });

export const loadWidgetData = createThunkAction('layer-card/loadWidgetData', id =>
  (dispatch) => {
    if (id) {
      const widgetService = new WidgetService(id, { apiURL: process.env.WRI_API_URL });
      widgetService.fetchData().then(response =>
        dispatch(setWidget(response)));
    } else {
      dispatch(setWidget(null));
    }
  });

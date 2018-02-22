import { createAction, createThunkAction } from 'redux-tools';

// Services
import WidgetService from 'services/WidgetService';
import DatasetService from 'services/DatasetService';

export const setDatasetData = createAction('layer-card/setDatasetData');

export const loadDatasetData = createThunkAction('layer-card/loadDa', ({ id, locale = 'en' }) =>
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

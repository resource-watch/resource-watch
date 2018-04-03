import { createAction, createThunkAction } from 'redux-tools';
import 'isomorphic-fetch';

// Services
import WidgetService from 'services/WidgetService';

export const setDatasetData = createAction('layer-card/setDatasetData');
export const setWidget = createAction('layer-card/setWidget');

export const loadDatasetData = createThunkAction('layer-card/loadDatasetData', params =>
  (dispatch, getState) => {
    const { common } = getState();

    if (params && params.id) {
      fetch(`${process.env.WRI_API_URL}/dataset/${params.id}?application=${process.env.APPLICATIONS}&language=${common.locale}&includes="metadata"&page[size]=999`)
        .then((data) => {
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

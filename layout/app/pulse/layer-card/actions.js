import { createAction, createThunkAction } from 'redux-tools';
import 'isomorphic-fetch';
import WRISerializer from 'wri-json-api-serializer';

// Services
import { fetchWidget } from 'services/widget';

export const setDatasetData = createAction('layer-card/setDatasetData');
export const setWidget = createAction('layer-card/setWidget');

export const loadDatasetData = createThunkAction('layer-card/loadDatasetData', params =>
  (dispatch, getState) => {
    const { common } = getState();
    if (params && params.id) {
      fetch(`${process.env.WRI_API_URL}/dataset/${params.id}?application=${process.env.APPLICATIONS}&language=${common.locale}&includes=metadata&page[size]=999`)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error(response.statusText);
        })
        .then(response => WRISerializer(response, { locale: common.locale }))
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
      fetchWidget(id).then(response =>
        dispatch(setWidget(response)));
    } else {
      dispatch(setWidget(null));
    }
  });

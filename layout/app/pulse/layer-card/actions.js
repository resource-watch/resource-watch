import { createAction, createThunkAction } from 'redux-tools';

// Services
import { fetchWidget } from 'services/widget';
import { fetchDataset } from 'services/dataset';

export const setDatasetData = createAction('layer-card/setDatasetData');
export const setWidget = createAction('layer-card/setWidget');

export const loadDatasetData = createThunkAction('layer-card/loadDatasetData', params =>
  (dispatch, getState) => {
    if (params && params.id) {
      fetchDataset(params.id, { includes: 'metadata', 'page[size]': 999 })
        .then(data => dispatch(setDatasetData(data)));
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

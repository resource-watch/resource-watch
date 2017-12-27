import { createAction, createThunkAction } from 'redux-actions';

import FiltersService from 'services/FiltersService';

import { setDatasetsFilters, setUrlParams } from 'redactions/explore';

export const setDataFilters = createAction('explore-dataset-filters/setDataFilters');
export const setFilter = createAction('explore-dataset-filters/setFilter');

export const getFiltersData = createThunkAction('explore-dataset-filters/getFiltersData', () =>
  (dispatch) => {
    Promise.all([
      FiltersService.getTopics(),
      FiltersService.getGeographies(),
      FiltersService.getDataTypes()
    ]
    ).then((values = []) => {
      const data = {};
      values.map(val => Object.assign(data, val));
      dispatch(setDataFilters(data));
    });
  }
);

export const onSetDatasetFilter = createThunkAction('explore-dataset-filters/onSetDatasetFilter', (filter = {}) =>
  (dispatch) => {
    dispatch(setFilter(filter));
    dispatch(setDatasetsFilters(filter));
    dispatch(setUrlParams());
  }
);

export const clearFilters = createThunkAction('explore-dataset-filters/clearFilters', () =>
  (dispatch) => {
    dispatch(setFilter({}));
    dispatch(setDatasetsFilters({}));
    dispatch(setUrlParams());
  }
);

export const removeTagFilter = createThunkAction('explore-dataset-filters/removeTagFilter', () =>
  (dispatch) => {
    dispatch(setUrlParams());
  }
);

import { createAction, createThunkAction } from 'redux-actions';

import FiltersService from 'services/FiltersService';

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

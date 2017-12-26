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

export const onSetDatasetFilter = createThunkAction('explore-dataset-filters/onSetDatasetFilter', (filter = {}) =>
  (dispatch) => {
    const key = Object.keys(filter)[0];
    dispatch(setFilter(filter));
    dispatch(setDatasetsTagFilter(key, filter[key])); // this is bullshit, but need it to keep consistency. Remove ASAP
    dispatch(updateURL());
  }
);

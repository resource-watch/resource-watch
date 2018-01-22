import { createAction, createThunkAction } from 'redux-tools';

import FiltersService from 'services/FiltersService';

import { setUrlParams } from 'redactions/explore';

export const setDataFilters = createAction('explore-dataset-filters/setDataFilters');

export const getFiltersData = createThunkAction('explore-dataset-filters/getFiltersData', () =>
  (dispatch) => {
    Promise.all([
      FiltersService.getTopics(),
      // NOTE: We're temporarily hiding the geographies filter
      // FiltersService.getGeographies(),
      FiltersService.getDataTypes()
    ]
    ).then((values = []) => {
      const data = {};
      values.map(val => Object.assign(data, val));
      dispatch(setDataFilters(data));
    });
  }
);

export const setFilters = createThunkAction('explore-dataset-filters/setFilters', () =>
  (dispatch) => {
    dispatch(setUrlParams());
  }
);

export const onSetDatasetFilter = createThunkAction('explore-dataset-filters/onSetDatasetFilter', (filter = {}) =>
  (dispatch) => {
    dispatch(setFilters(filter));
    dispatch(setUrlParams());
  }
);

export const clearFilters = createThunkAction('explore-dataset-filters/clearFilters', () =>
  (dispatch) => {
    dispatch(setUrlParams());
  }
);

export const removeTagFilter = createThunkAction('explore-dataset-filters/removeTagFilter', () =>
  (dispatch) => {
    dispatch(setUrlParams());
  }
);

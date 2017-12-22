import * as actions from './explore-dataset-filters-actions';

export const initialState = {
  data: {},
  filters: {}
};

export default {
  [actions.setDataFilters]: (state, { payload }) => ({ ...state, data: payload }),
  [actions.setFilter]: (state, { payload }) =>
    ({ ...state, filters: { ...state.filters, ...payload } })
};

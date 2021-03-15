import { createAction } from 'redux-tools';

export const SET_DISPLAY = 'SET_DISPLAY';
export const SET_SORT = 'SET_SORT';
export const SET_SEARCH = 'SET_SEARCH';
export const SET_PAGINATION = 'SET_PAGINATION';
export const SET_WIDGET_STATE = 'SET_WIDGET_STATE';

export const setDisplay = createAction(SET_DISPLAY);
export const setSort = createAction(SET_SORT);
export const setSearch = createAction(SET_SEARCH);
export const setPagination = createAction(SET_PAGINATION);
export const setWidgetState = createAction(SET_WIDGET_STATE);

export default {
  setDisplay,
  setSort,
  setSearch,
  setPagination,
  setWidgetState,
};

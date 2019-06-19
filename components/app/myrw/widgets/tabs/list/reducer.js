import {
  SET_DISPLAY,
  SET_SORT,
  SET_SEARCH,
  SET_PAGINATION,
  SET_WIDGET_STATE
} from './actions';

export default (state, { type, payload }) => {
  switch (type) {
    case SET_DISPLAY:
      return { ...state, display: payload };
    case SET_SORT:
      return { ...state, sort: payload };
    case SET_SEARCH:
      return { ...state, search: payload };
    case SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...payload
        }
      };
    case SET_WIDGET_STATE:
      return {
        ...state,
        widgets: {
          ...state.widgets,
          ...payload
        }
      };
    default:
      throw new Error('action not found');
  }
};

import {
  SET_WIDGETS,
  SET_LOADING,
  SET_ERROR,
  SET_TAB,
  SET_PAGE,
  SET_PAGES,
  SET_PAGE_SIZE,
  SET_TOTAL,
  SET_SEARCH
} from './actions';

export default (state, { type, payload }) => {
  console.log('type', type, 'payload', payload);
  switch (type) {
    case SET_WIDGETS:
      return { ...state, widgets: payload };
    case SET_LOADING:
      return { ...state, loading: payload };
    case SET_ERROR:
      return { ...state, error: payload };
    case SET_TAB:
      return { ...state, tab: payload };
    case SET_PAGE:
      return { ...state, page: payload };
    case SET_PAGES:
      return { ...state, pages: payload };
    case SET_PAGE_SIZE:
      return { ...state, pageSize: payload };
    case SET_TOTAL:
      return { ...state, total: payload };
    case SET_SEARCH:
      return { ...state, search: payload };

    default:
      throw new Error('action not found');
  }
};

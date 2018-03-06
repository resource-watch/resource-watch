import * as actions from './search-actions';

export default {
  [actions.setSearchList]: (state, action) =>
    ({ ...state, list: action.payload }),

  [actions.setSearchTerm]: (state, action) =>
    ({ ...state, term: action.payload }),

  [actions.setSearchPage]: (state, action) =>
    ({ ...state, page: action.payload }),

  [actions.setSearchTotal]: (state, action) =>
    ({ ...state, total: action.payload }),

  [actions.setSearchLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setSearchError]: (state, action) =>
    ({ ...state, error: action.payload })

};

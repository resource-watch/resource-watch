import initialState from './share-modal-default-state';
import * as actions from './share-modal-actions';

export default {
  [actions.setShortLinks]: (state, action) =>
    ({ ...state, shortLinks: { ...state.shortLinks, ...action.payload } }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.resetShortLinks]: () => initialState

};

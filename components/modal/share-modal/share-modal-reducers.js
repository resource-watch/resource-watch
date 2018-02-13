import * as actions from './share-modal-actions';

export default {
  [actions.setLinks]: (state, { payload }) => ({ ...state, links: payload }),
  [actions.setTab]: (state, { payload }) => ({ ...state, tab: payload }),
  [actions.setAnalytics]: (state, { payload }) => ({ ...state, analytics: payload })
};

import * as actions from './try-subscription-modal-actions';
import initialState from './try-subscription-modal-initial-state';

export default {
  [actions.setTrySubscriptionModalLoading]: (state, { payload }) =>
    ({ ...state, loading: payload, error: null }),
  [actions.setTrySubscriptionModalError]: (state, { payload }) =>
    ({ ...state, loading: false, error: payload }),
  [actions.setTrySubscriptionModal]: (state, { payload }) =>
    ({ ...state, data: payload }),
  [actions.resetTrySubscriptionModal]: () => initialState
};

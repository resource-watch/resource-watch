import { toastr } from 'react-redux-toastr';
import { createAction, createThunkAction } from 'redux-tools';

export const setTrySubscriptionModalLoading = createAction('try-subscription-modal/setTrySubscriptionModalLoading');
export const setTrySubscriptionModalError = createAction('try-subscription-modal/setTrySubscriptionModalError');
export const setTrySubscriptionModal = createAction('try-subscription-modal/setTrySubscriptionModal');
export const resetTrySubscriptionModal = createAction('try-subscription-modal/resetTrySubscriptionModal');

// Async actions
export const getTrySubscriptionModal = createThunkAction('try-subscription-modal/getTrySubscriptionModal', ({ query }) => (dispatch) => {
  dispatch(setTrySubscriptionModalLoading(true));

  return fetch(`${process.env.WRI_API_URL}/query?sql=${query}`)
    .then(response => response.json())
    .then(({ data, errors }) => {
      if (errors) {
        dispatch(setTrySubscriptionModalLoading(false));
        dispatch(setTrySubscriptionModalError(errors));
      } else {
        dispatch(setTrySubscriptionModalLoading(false));
        dispatch(setTrySubscriptionModal(data));
      }
    })
    .catch((errors) => {
      toastr.error('Error', 'Oops! Your query is not working');
      dispatch(setTrySubscriptionModalLoading(false));
      dispatch(setTrySubscriptionModalError(errors));
    });
});

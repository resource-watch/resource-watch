import * as actions from './actions';
import initialState from './initial-state';

export default {
  // user subscriptions
  [actions.setSubscriptions]: (state, { payload }) =>
    ({
      ...state,
      list: payload
    }),
  [actions.setSubscriptionsLoading]: (state, { payload }) =>
    ({
      ...state,
      loading: payload
    }),
  [actions.setSubscriptionsError]: (state, { payload }) =>
    ({
      ...state,
      error: payload
    }),
  // user subscriptions preview
  [actions.setAlertsPreview]: (state, { payload }) =>
    ({
      ...state,
      preview: {
        ...state.preview,
        list: payload
      }
    }),
  [actions.setSubscriptionsLoadingPreview]: (state, { payload }) =>
    ({
      ...state,
      preview: {
        ...state.preview,
        loading: payload
      }
    }),
  [actions.setSubscriptionsErrorPreview]: (state, { payload }) =>
    ({
      ...state,
      preview: {
        ...state.preview,
        error: payload
      }
    }),
  [actions.clearSubscriptionsPreview]: state => ({ ...state, list: initialState.list }),
  // areas
  [actions.setAreas]: (state, { payload }) =>
    ({
      ...state,
      areas: {
        ...state.areas,
        list: payload
      }
    }),
  [actions.setAreasLoading]: (state, { payload }) =>
    ({
      ...state,
      areas: {
        ...state.areas,
        loading: payload
      }
    }),
  [actions.setAreasError]: (state, { payload }) =>
    ({
      ...state,
      areas: {
        ...state.areas,
        error: payload
      }
    }),
  // user areas
  [actions.setUserAreas]: (state, { payload }) =>
    ({
      ...state,
      userAreas: {
        ...state.userAreas,
        list: payload
      }
    }),
  [actions.setUserAreasLoading]: (state, { payload }) =>
    ({
      ...state,
      userAreas: {
        ...state.userAreas,
        loading: payload
      }
    }),
  [actions.setUserAreasError]: (state, { payload }) =>
    ({
      ...state,
      userAreas: {
        ...state.userAreas,
        error: payload
      }
    }),
  // datasets
  [actions.setDatasets]: (state, { payload }) =>
    ({
      ...state,
      datasets: {
        ...state.datasets,
        list: payload
      }
    }),
  [actions.setDatasetsLoading]: (state, { payload }) =>
    ({
      ...state,
      datasets: {
        ...state.datasets,
        loading: payload
      }
    }),
  [actions.setDatasetsError]: (state, { payload }) =>
    ({
      ...state,
      datasets: {
        ...state.datasets,
        error: payload
      }
    }),
  // subscription creation
  [actions.setSubscriptionSuccess]: (state, { payload }) =>
    ({
      ...state,
      subscriptionCreation: {
        ...state.subscriptionCreation,
        success: payload
      }
    }),
  [actions.setSubscriptionLoading]: (state, { payload }) =>
    ({
      ...state,
      subscriptionCreation: {
        ...state.subscriptionCreation,
        loading: payload
      }
    }),
  [actions.setSubscriptionError]: (state, { payload }) =>
    ({
      ...state,
      subscriptionCreation: {
        ...state.subscriptionCreation,
        error: payload
      }
    }),
  [actions.clearLocalSubscriptions]: state =>
    ({
      ...state,
      subscriptionCreation: { ...initialState.subscriptionCreation }
    }),
  // user selection
  [actions.setUserSelection]: (state, { payload }) =>
    ({
      ...state,
      userSelection: {
        ...state.userSelection,
        ...payload
      }
    }),
  [actions.clearUserSelection]: state =>
    ({
      ...state,
      userSelection: { ...initialState.userSelection }
    }),
  [actions.resetModal]: state =>
    ({
      ...state,
      list: initialState.list,
      loading: initialState.loading,
      error: initialState.error,
      userSelection: initialState.userSelection,
      subscriptionCreation: initialState.subscriptionCreation
    })
};

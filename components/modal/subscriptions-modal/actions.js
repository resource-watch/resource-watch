import { createAction, createThunkAction } from 'redux-tools';
import { toastr } from 'react-redux-toastr';
import { replace } from 'layer-manager';
import axios from 'axios';
import moment from 'moment';

// services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';
import DatasetService from 'services/DatasetService';
import { fetchQuery } from 'services/query';

const areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
const userService = new UserService({ apiURL: process.env.WRI_API_URL });

// actions – user subscriptions
export const setSubscriptions = createAction('SUBSCRIPTIONS__SET-SUBSCRIPTIONS');
export const setSubscriptionsLoading = createAction('SUBSCRIPTIONS__SET-SUBSCRIPTIONS-LOADING');
export const setSubscriptionsError = createAction('SUBSCRIPTIONS__SET-SUBSCRIPTIONS-ERROR');
export const clearSubscriptions = createAction('SUBSCRIPTIONS__CLEAR-SUBSCRIPTIONS');
export const setAlertsPreview = createAction('ALERTS__SET-ALERTS-PREVIEW');
export const setSubscriptionsLoadingPreview = createAction('ALERTS__SET-ALERTS-LOADING');
export const setSubscriptionsErrorPreview = createAction('ALERTS__SET-ALERTS-ERROR');
export const clearSubscriptionsPreview = createAction('ALERTS__CLEAR-ALERTS');

export const getUserSubscriptions = createThunkAction('SUBSCRIPTIONS__GET-USER-SUBSCRIPTIONS', () =>
  (dispatch, getState) => {
    const { user } = getState();
    const { token } = user;

    dispatch(setSubscriptionsLoading(true));

    userService.getSubscriptions(token)
      .then((subscriptions = []) => {
        dispatch(setSubscriptions(subscriptions));
        dispatch(setSubscriptionsLoading(false));
      })
      .catch((err) => {
        dispatch(setSubscriptionsError(err));
        toastr.error('Error loading user subscriptions', err);
      });
  });

// actions - user subscriptions preview
export const getUserSubscriptionsPreview = createThunkAction('SUBSCRIPTIONS__GET-USER-SUBSCRIPTIONS-PREVIEW', () =>
  (dispatch, getState) => {
    const { user, subscriptions } = getState();
    const { token } = user;
    const { userSelection } = subscriptions;
    const { datasets } = userSelection;
    const yesterday = moment().subtract(1, 'day');
    // provisionally, sets date range from yesterday to a week ago
    const params = {
      begin: yesterday.subtract(1, 'week').format('MM-DD-YYYY'),
      end: yesterday.format('MM-DD-YYYY')
    };
    const fetchs = datasets.map((dataset) => {
      const selectedSubscription = dataset.subscriptions.find(
        _subscription => _subscription.selected
      );

      if (selectedSubscription) {
        const { query } = selectedSubscription;
        return fetchQuery(token, replace(query, params));
      }

      return null;
    });

    dispatch(setSubscriptionsLoadingPreview(true));

    axios.all(fetchs)
      .then(axios.spread((...responses) => {
        dispatch(setAlertsPreview(responses.map(response => response.data.data)));
      }))
      .catch((err) => {
        dispatch(setSubscriptionsError(err));
        toastr.error('Error loading preview', err);
      })
      .then(() => { dispatch(setSubscriptionsLoadingPreview(false)); });
  });

// actions – areas
export const setAreas = createAction('SUBSCRIPTIONS__SET-AREAS');
export const setAreasLoading = createAction('SUBSCRIPTIONS__SET-AREAS-LOADING');
export const setAreasError = createAction('SUBSCRIPTIONS__SET-AREAS-ERROR');

export const getAreas = createThunkAction('SUBSCRIPTIONS__GET-AREAS', () =>
  (dispatch) => {
    dispatch(setAreasLoading(true));

    areasService.fetchCountries()
      .then((areas = []) => {
        dispatch(setAreas(areas));
        dispatch(setAreasLoading(false));
      })
      .catch((err) => {
        dispatch(setAreasError(err));
        toastr.error('Error loading areas', err);
      });
  });

// actions – user areas
export const setUserAreas = createAction('SUBSCRIPTIONS__SET-USER-AREAS');
export const setUserAreasLoading = createAction('SUBSCRIPTIONS__SET-USER-AREAS-LOADING');
export const setUserAreasError = createAction('SUBSCRIPTIONS__SET-USER-AREAS-ERROR');

export const getUserAreas = createThunkAction('SUBSCRIPTIONS__GET-USER-AREAS', () =>
  (dispatch, getState) => {
    const { user } = getState();
    const { token } = user;

    dispatch(setUserAreasLoading(true));

    userService.getUserAreas(token)
      .then((userAreas = []) => {
        dispatch(setUserAreas(userAreas));
        dispatch(setUserAreasLoading(false));
      })
      .catch((err) => {
        dispatch(setUserAreasError(err));
        toastr.error('Error loading user areas', err);
      });
  });

// actions – datasets
export const setDatasets = createAction('SUBSCRIPTIONS__SET-DATASETS');
export const setDatasetsLoading = createAction('SUBSCRIPTIONS__SET-DATASETS-LOADING');
export const setDatasetsError = createAction('SUBSCRIPTIONS__SET-DATASETS-ERROR');

export const getDatasets = createThunkAction('SUBSCRIPTIONS__GET-DATASETS', () =>
  (dispatch, getState) => {
    const { common } = getState();
    const { locale } = common;
    const dasetService = new DatasetService(null, {
      apiURL: process.env.WRI_API_URL,
      language: locale
    });

    dispatch(setDatasetsLoading(true));

    dasetService.getSubscribableDatasets()
      .then((datasets = []) => {
        dispatch(setDatasets(datasets));
        dispatch(setDatasetsLoading(false));
      })
      .catch((err) => {
        dispatch(setDatasetsError(err));
        toastr.error('Error loading suscribable datasets', err);
      });
  });

// actions – user selection
export const setUserSelection = createAction('SUBSCRIPTIONS__SET-USER-SELECTION');
export const clearUserSelection = createAction('SUBSCRIPTIONS__CLEAR-USER-SELECTION');

// actions – reset
export const resetModal = createAction('SUBSCRIPTIONS__RESET-MODAL');

// actions – subscription creation
export const setSubscriptionSuccess = createAction('SUBSCRIPTIONS__SET_SUBSCRIPTION_SUCCESS');
export const setSubscriptionLoading = createAction('SUBSCRIPTIONS__SET_SUBSCRIPTION_LOADING');
export const setSubscriptionError = createAction('SUBSCRIPTIONS__SET_SUBSCRIPTION_ERROR');
export const clearLocalSubscriptions = createAction('SUBSCRIPTIONS__CLEAR_LOCA_SUBSCRIPTIONS');

export const createSubscriptionToArea = createThunkAction('SUBSCRIPTIONS__CREATE-SUBSCRIPTION-ON-AREA', () =>
  (dispatch, getState) => {
    const { subscriptions, user, common } = getState();
    const { userSelection } = subscriptions;
    const { area, datasets } = userSelection;
    const { areaId } = area;
    const { locale } = common;

    const datasetIds = datasets.map(dataset => dataset.id);
    const datasetsQuery = datasets.map(dataset => ({
      d: dataset.id,
      type: (dataset.subscriptions.find(_subscription => _subscription.selected) || {}).value,
      threshold: dataset.threshold
    }));

    dispatch(setSubscriptionSuccess(false));
    dispatch(setSubscriptionLoading(true));

    return userService.createSubscriptionToArea(
      areaId,
      datasetIds,
      datasetsQuery,
      user,
      locale
    ).then(() => {
      dispatch(setSubscriptionSuccess(true));
      dispatch(setSubscriptionLoading(false));
    }).catch((err) => {
      dispatch(setSubscriptionError(err));
      dispatch(setSubscriptionLoading(false));

      toastr.error('Error: unable to create the subscription', err);
    });
  });

export const createSubscriptionOnNewArea = createThunkAction('SUBSCRIPTIONS__CREATE-SUBSCRIPTION-NEW-AREA', () =>
  (dispatch, getState) => {
    const { subscriptions, user } = getState();
    const { userSelection } = subscriptions;
    const { area, datasets } = userSelection;
    const { label, isGeostore } = area;
    const { token } = user;
    const promises = [];

    dispatch(setSubscriptionSuccess(false));
    dispatch(setSubscriptionLoading(true));

    datasets.forEach((_dataset) => {
      const datasetId = _dataset.id;
      const datasetQuery = ({
        d: _dataset.id,
        type: (_dataset.subscriptions.find(_subscription => _subscription.selected) || {}).value,
        threshold: _dataset.threshold
      });

      const promise = userService.createNewArea(label, isGeostore, token)
        .then(({ data }) => {
          const areaID = data.id;

          userService.createSubscriptionToArea(
            areaID,
            datasetId,
            datasetQuery,
            user
          ).then(() => {
            dispatch(setSubscriptionSuccess(true));
            dispatch(setSubscriptionLoading(false));
          }).catch((err) => {
            dispatch(setSubscriptionError(err));
            dispatch(setSubscriptionLoading(false));

            toastr.error('Error: unable to create the subscription', err);
          });
        })
        .catch((err) => {
          dispatch(setSubscriptionError(err));
          dispatch(setSubscriptionLoading(false));
          toastr.error('Error: unable to create area', err);
        });

      promises.push(promise);
    });

    return Promise.all(promises)
      .then(() => {
        dispatch(setSubscriptionSuccess(false));
        dispatch(setSubscriptionLoading(true));
      })
      .catch((err) => {
        dispatch(setSubscriptionError(err));
        dispatch(setSubscriptionLoading(false));
        toastr.error('Error: unable to create area', err);
      });
  });

export const updateSubscription = createThunkAction('SUBSCRIPTIONS__UPDATE-SUBSCRIPTION', currentSubscription =>
  (dispatch, getState) => {
    const { subscriptions, user, common } = getState();
    const { userSelection } = subscriptions;
    const { datasets } = userSelection;
    const { locale } = common;
    const { id } = currentSubscription;
    const promises = [];

    dispatch(setSubscriptionSuccess(false));
    dispatch(setSubscriptionLoading(true));

    datasets.forEach((_dataset) => {
      const datasetId = _dataset.id;
      const datasetQuery = {
        d: _dataset.id,
        type: (_dataset.subscriptions.find(_subscription => _subscription.selected) || {}).value,
        threshold: _dataset.threshold
      };

      const promise = userService.updateSubscriptionToArea(
        id,
        datasetId,
        datasetQuery,
        user,
        locale
      ).then(() => {
        dispatch(setSubscriptionSuccess(true));
        dispatch(setSubscriptionLoading(false));
      }).catch((err) => {
        dispatch(setSubscriptionError(err));
        dispatch(setSubscriptionLoading(false));

        toastr.error('Error: unable to update the subscription', err);
      });

      promises.push(promise);
    });


    Promise.all(promises)
      .then(() => {
        dispatch(setSubscriptionSuccess(false));
        dispatch(setSubscriptionLoading(true));
      })
      .catch((err) => {
        dispatch(setSubscriptionError(err));
        dispatch(setSubscriptionLoading(false));
        toastr.error('unable to update the subscription', err);
      });
  });


export default {
  setAreas,
  setAreasLoading,
  setAreasError,
  getAreas,

  setSubscriptions,
  setSubscriptionsLoading,
  setSubscriptionsError,
  getUserSubscriptions,
  getUserSubscriptionsPreview,

  setUserAreas,
  setUserAreasLoading,
  setUserAreasError,
  getUserAreas,

  setDatasets,
  setDatasetsLoading,
  setDatasetsError,
  getDatasets,

  setUserSelection,
  clearUserSelection,

  resetModal,

  setSubscriptionSuccess,
  setSubscriptionLoading,
  setSubscriptionError,
  clearLocalSubscriptions,

  createSubscriptionToArea,
  createSubscriptionOnNewArea,
  updateSubscription
};

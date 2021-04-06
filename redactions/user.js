import { toastr } from 'react-redux-toastr';
import { createAction, createThunkAction } from 'redux-tools';
import axios from 'axios';

// Utils
import { mergeSubscriptions, setGeoLayer, setCountryLayer } from 'utils/user/areas';

// services
import {
  fetchUserAreas,
  deleteArea,
} from 'services/areas';
import {
  fetchSubscriptions,
  deleteSubscription,
} from 'services/subscriptions';
import { fetchDatasets } from 'services/dataset';
import { fetchGeostore, fetchCountry } from 'services/geostore';

/**
 * CONSTANTS
*/
const SET_USER = 'user/setUser';
// areas
const SET_USER_AREAS = 'user/setUserAreas';
const SET_USER_AREAS_ERROR = 'user/setUserAreasError';
const SET_USER_AREAS_LOADING = 'user/setUserAreasLoading';
const SET_USER_AREA_LAYER_GROUP = 'user/setUserAreaLayerGroup';

/**
 * REDUCER
*/
const initialState = {
  areas: {
    items: [],
    layerGroups: {},
    loading: false,
    error: null,
  },
};

export default function User(state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return { ...state, ...action.payload };
    }

    case SET_USER_AREAS: {
      return {
        ...state,
        areas: {
          ...state.areas,
          items: action.payload,
        },
      };
    }

    case SET_USER_AREA_LAYER_GROUP: {
      const layerGroup = { [action.payload.area.id]: action.payload.layerGroups };
      const layerGroups = { ...state.areas.layerGroups, ...layerGroup };

      return {
        ...state,
        areas: {
          ...state.areas,
          layerGroups,
        },
      };
    }

    case SET_USER_AREAS_ERROR: {
      return {
        ...state,
        areas: {
          ...state.areas,
          error: action.payload,
        },
      };
    }

    case SET_USER_AREAS_LOADING: {
      return {
        ...state,
        areas: {
          ...state.areas,
          loading: action.payload,
        },
      };
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - setUser
 * - toggleFavourite
*/
export function setUser(user) {
  return (dispatch) => {
    if (!user) return;

    const userObj = { ...user };

    if (userObj.token) {
      userObj.token = userObj.token.includes('Bearer') ? userObj.token : `Bearer ${userObj.token}`;
    }

    dispatch({ type: SET_USER, payload: userObj });
  };
}

// Areas
export const setUserAreas = createAction(SET_USER_AREAS);
export const setUserAreasError = createAction(SET_USER_AREAS_ERROR);
export const setUserAreasLoading = createAction(SET_USER_AREAS_LOADING);
export const setUserAreaLayerGroup = createAction(SET_USER_AREA_LAYER_GROUP);

export const getUserAreaLayerGroups = createThunkAction(
  'user/getUserAreaLayerGroups',
  (area = {}) => (dispatch) => {
    const { geostore, iso } = area;
    if (geostore) {
      return fetchGeostore(geostore).then((geo) => {
        dispatch(setUserAreaLayerGroup({ area, layerGroups: [setGeoLayer(geo)] }));
      });
    }

    return fetchCountry(iso.country).then((country) => {
      dispatch(setUserAreaLayerGroup({ area, layerGroups: [setCountryLayer(country)] }));
    });
  },
);

export const getUserAreas = createThunkAction(
  'user/getUserAreas',
  () => (dispatch, getState) => {
    const { user: { token } } = getState();

    dispatch(setUserAreasLoading(true));
    axios.all([fetchUserAreas(token), fetchSubscriptions(token)])
      .then(axios.spread((userAreas, subscriptions = []) => {
        const datasetsToFetch = new Set();
        subscriptions.forEach((_subscription) => {
          (_subscription.datasets || []).forEach((_dataset) => datasetsToFetch.add(_dataset));
        });

        if (datasetsToFetch.size) {
          fetchDatasets({
            ids: [...datasetsToFetch].join(','),
            includes: 'metadata',
            'page[size]': 999,
          })
            .then((datasets) => {
              const userAreasWithSubscriptions = mergeSubscriptions(
                userAreas,
                subscriptions,
                datasets,
              );

              dispatch(setUserAreas(userAreasWithSubscriptions));
              dispatch(setUserAreasLoading(false));
            });
        } else {
          dispatch(setUserAreas(userAreas));
        }
      }))
      .catch(() => {});
  },
);

export const removeUserArea = createThunkAction(
  'user/removeUserArea',
  (area = {}) => (dispatch, getState) => {
    const { user } = getState();

    if (area.subscriptions) {
      return axios.all(area.subscriptions.map((_sub) => deleteSubscription(_sub.id, user.token)))
        .then(() => deleteArea(area.id, user.token)
          .then(() => {
            toastr.success('Area deleted', `The area "${area.name}" was deleted successfully.`);
            dispatch(getUserAreas());
          }));
    }

    return deleteArea(area.id, user.token).then(() => {
      toastr.success('Area deleted', `The area "${area.name}" was deleted successfully.`);
      dispatch(getUserAreas());
    });
  },
);

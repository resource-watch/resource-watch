import { toastr } from 'react-redux-toastr';
import { createAction, createThunkAction } from 'redux-tools';
import axios from 'axios';

// Utils
import { mergeSubscriptions, setGeoLayer, setCountryLayer } from 'utils/user/areas';

// actions
import { getDatasetsByTab } from 'redactions/admin/datasets';

// services
import {
  fetchUserAreas,
  deleteArea
} from 'services/areas';
import {
  deleteFavourite,
  createFavourite,
  fetchFavourites
} from 'services/favourites';
import {
  fetchSubscriptions,
  deleteSubscription
} from 'services/subscriptions';
import {
  fetchAllCollections,
  deleteCollection as deleteCollectionService,
  addResourceToCollection as addResourceToCollectionService,
  removeResourceFromCollection as removeResourceFromCollectionService,
  createCollection
} from 'services/collections';
import { fetchDatasets } from 'services/dataset';
import { fetchGeostore, fetchCountry } from 'services/geostore';

/**
 * CONSTANTS
*/
const SET_USER = 'user/setUser';
// favourites
const SET_USER_FAVOURITES = 'user/setUserFavourites';
const SET_USER_FAVOURITES_LOADING = 'user/setUserFavouritesLoading';
const SET_USER_FAVOURITES_FIRST_LOAD = 'user/setUserFavouritesFirstLoad';
const SET_USER_FAVOURITES_ERROR = 'user/setUserFavouritesError';
// collections
const SET_USER_COLLECTIONS = 'user/setUserCollections';
const SET_USER_COLLECTIONS_LOADING = 'user/setUserCollectionsLoading';
const SET_USER_COLLECTIONS_FIRST_LOAD = 'user/setUserCollectionsFirstLoad';
const SET_USER_COLLECTIONS_UPDATE_LOADING = 'user/setUserCollectionsUpdateLoading';
const SET_COLLECTIONS_LOADING = 'user/setCollectionsLoading';
const SET_USER_COLLECTIONS_FILTER = 'user/setUserCollectionsFilter';
const SET_USER_COLLECTIONS_ERROR = 'user/setUserCollectionsError';
// areas
const SET_USER_AREAS = 'user/setUserAreas';
const SET_USER_AREAS_ERROR = 'user/setUserAreasError';
const SET_USER_AREAS_LOADING = 'user/setUserAreasLoading';
const SET_USER_AREA_LAYER_GROUP = 'user/setUserAreaLayerGroup';

/**
 * REDUCER
*/
const initialState = {
  favourites: {
    items: [],
    loading: false,
    error: null,
    isFirstLoad: false
  },
  collections: {
    filter: '',
    loading: false,
    items: [],
    loadingQueue: [],
    error: null,
    isFirstLoad: false
  },
  areas: {
    items: [],
    layerGroups: {},
    loading: false,
    error: null
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return { ...state, ...action.payload };
    }

    case SET_USER_FAVOURITES: {
      return {
        ...state,
        favourites: {
          ...state.favourites,
          items: action.payload
        }
      };
    }

    case SET_USER_FAVOURITES_LOADING: {
      return {
        ...state,
        favourites: {
          ...state.favourites,
          loading: action.payload
        }
      };
    }

    case SET_USER_FAVOURITES_FIRST_LOAD: {
      return {
        ...state,
        favourites: {
          ...state.favourites,
          isFirstLoad: action.payload
        }
      };
    }

    case SET_USER_FAVOURITES_ERROR: {
      return {
        ...state,
        favourites: {
          ...state.favourites,
          error: action.payload
        }
      };
    }

    case SET_USER_COLLECTIONS: {
      return {
        ...state,
        collections: {
          ...state.collections,
          items: action.payload
        }
      };
    }

    case SET_USER_COLLECTIONS_LOADING: {
      return {
        ...state,
        collections: {
          ...state.collections,
          loadingQueue: action.payload.map(collection =>
            ({ id: collection.id, loading: false }))
        }
      };
    }

    case SET_USER_COLLECTIONS_FIRST_LOAD: {
      return {
        ...state,
        collections: {
          ...state.collections,
          isFirstLoad: action.payload
        }
      };
    }

    case SET_COLLECTIONS_LOADING: {
      return {
        ...state,
        collections: {
          ...state.collections,
          loading: action.payload
        }
      };
    }

    case SET_USER_COLLECTIONS_FILTER: {
      return {
        ...state,
        collections: {
          ...state.collections,
          filter: action.payload
        }
      };
    }

    case SET_USER_COLLECTIONS_UPDATE_LOADING: {
      const { id, loading } = action.payload;
      const loadingQueue = [...state.collections.loadingQueue];
      const index = loadingQueue.findIndex(loader => loader.id === id);

      if (index === -1) return state;

      loadingQueue[index] = { id, loading };

      return {
        ...state,
        collections: {
          ...state.collections,
          loadingQueue
        }
      };
    }

    case SET_USER_COLLECTIONS_ERROR: {
      return {
        ...state,
        collections: {
          ...state.collections,
          error: action.payload
        }
      };
    }

    case SET_USER_AREAS: {
      return {
        ...state,
        areas: {
          ...state.areas,
          items: action.payload
        }
      };
    }

    case SET_USER_AREA_LAYER_GROUP: {
      const layerGroup = { [action.payload.area.id]: action.payload.layerGroups };
      const layerGroups = Object.assign({}, state.areas.layerGroups, layerGroup);

      return {
        ...state,
        areas: {
          ...state.areas,
          layerGroups
        }
      };
    }

    case SET_USER_AREAS_ERROR: {
      return {
        ...state,
        areas: {
          ...state.areas,
          error: action.payload
        }
      };
    }

    case SET_USER_AREAS_LOADING: {
      return {
        ...state,
        areas: {
          ...state.areas,
          loading: action.payload
        }
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
      userObj.token2 = userObj.token.includes('Bearer') ? userObj.token2 : userObj.token;
      userObj.token = userObj.token.includes('Bearer') ? userObj.token : `Bearer ${userObj.token}`;
    }

    // TO-DO: this "serialization" should be done in the API
    // eslint-disable-next-line no-underscore-dangle
    if (userObj._id) userObj.id = userObj._id;

    dispatch({ type: SET_USER, payload: userObj });
  };
}


// FAVOURITES
export const setFavouriteLoading = createAction(SET_USER_FAVOURITES_LOADING);
export const setFavouriteFirstLoad = createAction(SET_USER_FAVOURITES_FIRST_LOAD);
export const setFavouriteError = createAction(SET_USER_FAVOURITES_ERROR);

export const getUserFavourites = createThunkAction('user/getUserFavourites', () =>
  (dispatch, getState) => {
    const { token } = getState().user;

    if (!token) {
      return;
    }

    dispatch(setFavouriteLoading(true));
    fetchFavourites(token)
      .then((data) => {
        dispatch(setFavouriteLoading(false));
        dispatch(setFavouriteFirstLoad(true));
        dispatch({ type: SET_USER_FAVOURITES, payload: data });
      })
      .catch((error) => {
        dispatch(setFavouriteLoading(false));
        dispatch(setFavouriteError(error));
        dispatch({ type: SET_USER_FAVOURITES, payload: [] });
      });
  });

export const toggleFavourite = createThunkAction('user/toggleFavourite', (payload = {}) =>
  (dispatch, getState) => {
    const { token } = getState().user;
    const { favourite, resource } = payload;

    dispatch(setFavouriteLoading(true));

    if (favourite.id) {
      const { id } = favourite;
      deleteFavourite(token, id)
        .then(() => {
          // asks for the new updated list of favourites
          dispatch(getUserFavourites());
        })
        .catch((error) => {
          dispatch(setFavouriteLoading(false));
          dispatch(setFavouriteError(error));
        });

      return;
    }

    createFavourite(token, resource)
      .then(() => {
        // asks for the new updated list of favourites
        dispatch(getUserFavourites());
      })
      .catch(({ errors }) => {
        dispatch(setFavouriteLoading(false));
        dispatch(setFavouriteError(errors));
      });
  });

// COLLECTIONS
export const setUserCollections = createAction(SET_USER_COLLECTIONS);
export const setCollectionsLoading = createAction(SET_COLLECTIONS_LOADING);
export const setCollectionsFirstLoad = createAction(SET_USER_COLLECTIONS_FIRST_LOAD);
export const setUserCollectionsErrors = createAction(SET_USER_COLLECTIONS_ERROR);
export const setUserCollectionsLoading = createAction(SET_USER_COLLECTIONS_LOADING);
export const setUserCollectionsUpdateLoading = createAction(SET_USER_COLLECTIONS_UPDATE_LOADING);
export const setUserCollectionsFilter = createAction(SET_USER_COLLECTIONS_FILTER);

export const getUserCollections = createThunkAction('user/getUserCollections', () =>
  (dispatch, getState) => {
    const { token } = getState().user;

    if (!token) {
      return null;
    }

    dispatch(setCollectionsLoading(true));

    return fetchAllCollections(token)
      .then((data) => {
        dispatch(setUserCollections(data));
        dispatch(setUserCollectionsLoading(data));
        dispatch(setCollectionsLoading(false));
        dispatch(setCollectionsFirstLoad(true));
      })
      .catch((error) => {
        dispatch(setUserCollectionsErrors(error));
        dispatch(setCollectionsLoading(false));
      });
  });


export const addCollection = createThunkAction('user/addCollection', (payload = {}) =>
  (dispatch, getState) => {
    const { token } = getState().user;
    const { collectionName } = payload;

    createCollection(token,
      {
        name: collectionName,
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        resources: []
      })
      .then(() => {
        // we ask for the updated list of collections
        dispatch(getUserCollections());
      })
      .catch((error) => {
        dispatch(setUserCollectionsErrors(error));
        toastr.error(error);
      });
  });

export const deleteCollection = createThunkAction('user/deleteCollection', (payload = {}) =>
  (dispatch, getState) => {
    const { token } = getState().user;
    const { collection } = payload;
    const { id, name } = collection;

    deleteCollectionService(token, id)
      .then(() => {
        // we ask for the updated list of collections
        dispatch(getUserCollections());
        dispatch(setUserCollectionsErrors(null));
        toastr.success('Collection deleted', `The collection "${name}" was deleted successfully.`);
      })
      .catch(({ errors }) => {
        dispatch(setUserCollectionsErrors(errors));
      });
  });

export const addResourceToCollection = createThunkAction(
  'user/addResourceToCollection',
  (payload = {}) =>
    (dispatch, getState) => {
      const { user, routes } = getState();
      const { collectionId, resource } = payload;
      const { subtab } = routes.query;

      dispatch(setUserCollectionsUpdateLoading({ id: collectionId, loading: true }));

      addResourceToCollectionService(user.token, collectionId, resource)
        .then(() => {
          dispatch(setUserCollectionsUpdateLoading({ id: collectionId, loading: false }));
          // we ask for the updated list of collections
          dispatch(getUserCollections());

          if (resource.type === 'dataset') dispatch(getDatasetsByTab(subtab));
        })
        .catch(({ errors }) => {
          dispatch(setUserCollectionsUpdateLoading({ id: collectionId, loading: false }));
          dispatch(setUserCollectionsErrors(errors));
        });
    }
);

export const removeResourceFromCollection = createThunkAction(
  'user/removeResourceFromCollection',
  (payload = {}) =>
    (dispatch, getState) => {
      const { user, routes } = getState();
      const { collectionId, resource } = payload;
      const { subtab } = routes.query;

      dispatch(setUserCollectionsUpdateLoading({ id: collectionId, loading: true }));

      removeResourceFromCollectionService(user.token, collectionId, resource)
        .then(() => {
          dispatch(setUserCollectionsUpdateLoading({ id: collectionId, loading: false }));
          // we ask for the updated list of collections
          dispatch(getUserCollections());

          if (resource.type === 'dataset') dispatch(getDatasetsByTab(subtab));
        })
        .catch(({ errors }) => {
          dispatch(setUserCollectionsUpdateLoading({ id: collectionId, loading: false }));
          dispatch(setUserCollectionsErrors(errors));
        });
    }
);

export const toggleCollection = createThunkAction(
  'user/toggleCollection',
  (payload = {}) =>
    (dispatch) => {
      const { isAdded, collectionId, resource } = payload;

      if (isAdded) dispatch(addResourceToCollection({ collectionId, resource }));
      if (!isAdded) dispatch(removeResourceFromCollection({ collectionId, resource }));
    }
);

// Areas
export const setUserAreas = createAction(SET_USER_AREAS);
export const setUserAreasError = createAction(SET_USER_AREAS_ERROR);
export const setUserAreasLoading = createAction(SET_USER_AREAS_LOADING);
export const setUserAreaLayerGroup = createAction(SET_USER_AREA_LAYER_GROUP);

export const getUserAreaLayerGroups = createThunkAction(
  'user/getUserAreaLayerGroups',
  (area = {}) =>
    (dispatch) => {
      const { geostore, iso } = area;
      if (geostore) {
        return fetchGeostore(geostore).then((geo) => {
          dispatch(setUserAreaLayerGroup({ area, layerGroups: [setGeoLayer(geo)] }));
        });
      }

      return fetchCountry(iso.country).then((country) => {
        dispatch(setUserAreaLayerGroup({ area, layerGroups: [setCountryLayer(country)] }));
      });
    }
);

export const getUserAreas = createThunkAction(
  'user/getUserAreas',
  () =>
    (dispatch, getState) => {
      const { user: { token } } = getState();

      dispatch(setUserAreasLoading(true));
      axios.all([fetchUserAreas(token), fetchSubscriptions(token)])
        .then(axios.spread((userAreas, subscriptions = []) => {
          const datasetsToFetch = new Set();
          subscriptions.forEach((_subscription) => {
            (_subscription.datasets || []).forEach(_dataset => datasetsToFetch.add(_dataset));
          });

          if (datasetsToFetch.size) {
            fetchDatasets({
              ids: [...datasetsToFetch].join(','),
              includes: 'metadata',
              'page[size]': 999
            })
              .then((datasets) => {
                const userAreasWithSubscriptions = mergeSubscriptions(
                  userAreas,
                  subscriptions,
                  datasets
                );

                dispatch(setUserAreas(userAreasWithSubscriptions));
                dispatch(setUserAreasLoading(false));
              });
          } else {
            dispatch(setUserAreas(userAreas));
          }
        }));
    }
);

export const removeUserArea = createThunkAction(
  'user/removeUserArea',
  (area = {}) => (dispatch, getState) => {
    const { user } = getState();

    if (area.subscriptions) {
      return axios.all(area.subscriptions.map(_sub => deleteSubscription(_sub.id, user.token)))
        .then(() =>
          deleteArea(area.id, user.token)
            .then(() => {
              toastr.success('Area deleted', `The area "${area.name}" was deleted successfully.`);
              dispatch(getUserAreas());
            }));
    }

    return deleteArea(area.id, user.token).then(() => {
      toastr.success('Area deleted', `The area "${area.name}" was deleted successfully.`);
      dispatch(getUserAreas());
    });
  }
);

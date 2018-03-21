import { toastr } from 'react-redux-toastr';
import { createAction, createThunkAction } from 'redux-tools';

// Utils
import { mergeSubscriptions, setGeoLayer, setCountryLayer } from 'utils/user/areas';

// actions
import { getDatasetsByTab } from 'redactions/admin/datasets';
import { getWidgetsByTab } from 'redactions/admin/widgets';

// services
import UserService from 'services/UserService';
import FavouritesService from 'services/favourites-service';
import CollectionsService from 'services/collections-service';
import DatasetService from 'services/DatasetService';
import AreasService from 'services/AreasService';

/**
 * CONSTANTS
*/
const SET_USER = 'user/setUser';
// favourites
const SET_USER_FAVOURITES = 'user/setUserFavourites';
const SET_USER_FAVOURITES_LOADING = 'user/setUserFavouritesLoading';
const SET_USER_FAVOURITES_ERROR = 'user/setUserFavouritesError';
// collections
const SET_USER_COLLECTIONS = 'user/setUserCollections';
const SET_USER_COLLECTIONS_LOADING = 'user/setUserCollectionsLoading';
const SET_USER_COLLECTIONS_UPDATE_LOADING = 'user/setUserCollectionsUpdateLoading';
const SET_COLLECTIONS_LOADING = 'user/setCollectionsLoading';
const SET_USER_COLLECTIONS_FILTER = 'user/setUserCollectionsFilter';
const SET_USER_COLLECTIONS_ERROR = 'user/setUserCollectionsError';
// areas
const SET_USER_AREAS = 'user/setUserAreas';
const SET_USER_AREAS_ERROR = 'user/serUserAreasError';
const SET_USER_AREA_LAYER_GROUP = 'user/setUserAreaLayerGroup';

/**
 * REDUCER
*/
const initialState = {
  favourites: {
    items: [],
    loading: false,
    error: null
  },
  collections: {
    filter: '',
    loading: false,
    items: [],
    loadingQueue: [],
    error: null
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

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - setUser
 * - setFavourites
 * - toggleFavourite
*/
export function setUser(user) {
  return (dispatch) => {
    if (!user || !user.token) {
      // If the user isn't logged in, we set the user variable as an empty object
      return;
    }

    const userObj = { ...user };
    if (userObj.token) {
      userObj.token = userObj.token.includes('Bearer') ? userObj.token : `Bearer ${userObj.token}`;
    }

    dispatch({ type: SET_USER, payload: userObj });
  };
}


// FAVOURITES
export const setFavouriteLoading = createAction(SET_USER_FAVOURITES_LOADING);
export const setFavouriteError = createAction(SET_USER_FAVOURITES_ERROR);

export const getUserFavourites = createThunkAction('user/getUserFavourites', () =>
  (dispatch, getState) => {
    const { token } = getState().user;

    if (!token) {
      return;
    }

    dispatch(setFavouriteLoading(true));

    return FavouritesService.getFavourites(token)
      .then(({ data }) => {
        dispatch(setFavouriteLoading(false));
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
      FavouritesService.deleteFavourite(token, id)
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

    FavouritesService.createFavourite(token, resource)
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
export const setUserCollectionsErrors = createAction(SET_USER_COLLECTIONS_ERROR);
export const setUserCollectionsLoading = createAction(SET_USER_COLLECTIONS_LOADING);
export const setUserCollectionsUpdateLoading = createAction(SET_USER_COLLECTIONS_UPDATE_LOADING);
export const setUserCollectionsFilter = createAction(SET_USER_COLLECTIONS_FILTER);

export const getUserCollections = createThunkAction('user/getUserCollections', () =>
  (dispatch, getState) => {
    const { token } = getState().user;

    if (!token) {
      return;
    }

    dispatch(setCollectionsLoading(true));

    return CollectionsService.getAllCollections(token)
      .then(({ data }) => {
        dispatch(setUserCollections(data));
        dispatch(setUserCollectionsLoading(data));
        dispatch(setCollectionsLoading(false));
      })
      .catch(({ errors }) => {
        dispatch(setUserCollectionsErrors(errors));
        dispatch(setCollectionsLoading(false));
      });
  });


export const addCollection = createThunkAction('user/addCollection', (payload = {}) =>
  (dispatch, getState) => {
    const { token } = getState().user;
    const { collectionName } = payload;

    CollectionsService.createCollection(token, collectionName)
      .then(() => {
        // we ask for the updated list of collections
        dispatch(getUserCollections());
      })
      .catch(({ errors }) => {
        dispatch(setUserCollectionsErrors(errors));
        const { status } = errors;

        // we shouldn't assume 400 is duplicated collection,
        // but there's no another way to find it out at this moment
        if (status === 400) {
          toastr.error('Collection duplicated', `The collection "${collectionName}" already exists.`);
        } else {
          toastr.error('Ops, something went wrong.');
        }
      });
  });

export const deleteCollection = createThunkAction('user/deleteCollection', (payload = {}) =>
  (dispatch, getState) => {
    const { token } = getState().user;
    const { collection } = payload;
    const { id, name } = collection;

    CollectionsService.deleteCollection(token, id)
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

      CollectionsService.addResourceToCollection(user.token, collectionId, resource)
        .then(() => {
          dispatch(setUserCollectionsUpdateLoading({ id: collectionId, loading: false }));
          // we ask for the updated list of collections
          dispatch(getUserCollections());

          if (resource.type === 'dataset') dispatch(getDatasetsByTab(subtab));
          if (resource.type === 'widget') dispatch(getWidgetsByTab(subtab));
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

      CollectionsService.removeResourceFromCollection(user.token, collectionId, resource)
        .then(() => {
          dispatch(setUserCollectionsUpdateLoading({ id: collectionId, loading: false }));
          // we ask for the updated list of collections
          dispatch(getUserCollections());

          if (resource.type === 'dataset') dispatch(getDatasetsByTab(subtab));
          if (resource.type === 'widget') dispatch(getWidgetsByTab(subtab));
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
export const setUserAreaLayerGroup = createAction(SET_USER_AREA_LAYER_GROUP);

export const getUserAreaLayerGroups = createThunkAction(
  'user/getUserAreaLayerGroups',
  (area = {}) =>
    (dispatch) => {
      const { attributes } = area;
      const areasService = new AreasService({ apiURL: process.env.WRI_API_URL });

      if (attributes.geostore) {
        return areasService.getGeostore(attributes.geostore).then((geo) => {
          dispatch(setUserAreaLayerGroup({ area, layerGroups: [setGeoLayer(geo)] }));
        });
      }

      return areasService.getCountry(attributes.iso.country).then((country) => {
        dispatch(setUserAreaLayerGroup({ area, layerGroups: [setCountryLayer(country)] }));
      });
    }
);

export const getUserAreas = createThunkAction(
  'user/getUserAreas',
  (payload = {}) =>
    (dispatch, getState) => {
      const { user, common } = getState();
      const userService = new UserService({ apiURL: process.env.WRI_API_URL });

      return userService.getUserAreas(user.token)
        .then((areas) => {
          // 1. fetch subscriptions then merge them with the area
          // 2. Get datasets
          // 3. Merge the 2 of them into the area
          return userService.getSubscriptions(user.token).then((subs) => {
            subs = subs.filter(sub => sub.attributes.params.area);
            const datasetsSet = new Set();
            subs.forEach(sub => sub.attributes.datasets
              .forEach(dataset => datasetsSet.add(dataset)));

            return DatasetService.getDatasets([...datasetsSet],
              common.locale, 'layer,metadata,vocabulary,widget')
              .then((datasets) => {
                if (payload.layerGroups) {
                  let layerGroups = [];
                  areas.forEach(area => {
                    layerGroups.push(dispatch(getUserAreaLayerGroups(area)));
                  });

                  return Promise.all(layerGroups).then(() => {
                    dispatch(setUserAreas(mergeSubscriptions(areas, subs, datasets)));
                  });
                }

                dispatch(setUserAreas(mergeSubscriptions(areas, subs, datasets)));
              });
          });
        })
        .catch(err => dispatch(setUserAreasError(err)));
    }
);

export const removeUserArea = createThunkAction(
  'user/removeUserArea',
  (area = {}) => (dispatch, getState) => {
    const { user } = getState();
    const userService = new UserService({ apiURL: process.env.WRI_API_URL });

    if (area.subscription) {
      return userService.deleteSubscription(area.subscription.id, user.token).then(() => {
        return userService.deleteArea(area.id, user.token).then(() => {
          toastr.success('Area deleted', `The area "${area.attributes.name}" was deleted successfully.`);
          dispatch(getUserAreas());
        });
      });
    }

    return userService.deleteArea(area.id, user.token).then(() => {
      toastr.success('Area deleted', `The area "${area.attributes.name}" was deleted successfully.`);
      dispatch(getUserAreas());
    });
  }
);


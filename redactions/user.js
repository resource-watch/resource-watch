import { toastr } from 'react-redux-toastr';
import { createAction, createThunkAction } from 'redux-tools';

// actions
import { getDatasetsByTab } from 'redactions/admin/datasets';
import { getWidgetsByTab } from 'redactions/admin/widgets';

// services
import FavouritesService from 'services/favourites-service';
import CollectionsService from 'services/collections-service';

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
const TOGGLE_COLLECTIONS_LOADING = 'user/toggleCollectionsLoading';
const SET_USER_COLLECTIONS_ERROR = 'user/setUserCollectionsError';


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
    loading: false,
    items: [],
    loadingQueue: [],
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

    case TOGGLE_COLLECTIONS_LOADING: {
      return {
        ...state,
        collections: {
          ...state.collections,
          loading: !state.collections.loading
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
export const toggleCollectionsLoading = createAction(TOGGLE_COLLECTIONS_LOADING);
export const setUserCollectionsErrors = createAction(SET_USER_COLLECTIONS_ERROR);
export const setUserCollectionsLoading = createAction(SET_USER_COLLECTIONS_LOADING);
export const setUserCollectionsUpdateLoading = createAction(SET_USER_COLLECTIONS_UPDATE_LOADING);

export const getUserCollections = createThunkAction('user/getUserCollections', () =>
  (dispatch, getState) => {
    const { token } = getState().user;

    if (!token) {
      return;
    }

    dispatch(toggleCollectionsLoading());

    return CollectionsService.getAllCollections(token)
      .then(({ data }) => {
        dispatch(setUserCollections(data));
        dispatch(setUserCollectionsLoading(data));
        dispatch(toggleCollectionsLoading());
      })
      .catch(({ errors }) => {
        dispatch(setUserCollectionsErrors(errors));
        dispatch(toggleCollectionsLoading());
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

export const addResourceToCollection = createThunkAction('user/addResourceToCollection',
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
    });

export const removeResourceFromCollection = createThunkAction('user/removeResourceFromCollection',
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
    });

export const toggleCollection = createThunkAction('user/toggleCollection',
  (payload = {}) =>
    (dispatch) => {
      const { isAdded, collectionId, resource } = payload;

      if (isAdded) dispatch(addResourceToCollection({ collectionId, resource }));
      if (!isAdded) dispatch(removeResourceFromCollection({ collectionId, resource }));
    });

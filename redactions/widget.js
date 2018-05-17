import 'isomorphic-fetch';
import isEmpty from 'lodash/isEmpty';

// Services
import WidgetService from 'services/WidgetService';
import DatasetService from 'services/DatasetService';
import RasterService from 'services/RasterService';
import LayersService from 'services/LayersService';
import UserService from 'services/UserService';

/**
 * CONSTANTS
*/
const GET_WIDGET_SUCCESS = 'GET_WIDGET_SUCCESS';
const GET_WIDGET_ERROR = 'GET_WIDGET_ERROR';
const GET_WIDGET_LOADING = 'GET_WIDGET_LOADING';
const SET_WIDGET_DATA = 'SET_WIDGET_DATA';
const SET_WIDGET_DATASET = 'SET_WIDGET_DATASET';
const SET_WIDGET_BAND_DESCRIPTION = 'SET_WIDGET_BAND_DESCRIPTION';
const SET_WIDGET_BAND_STATS = 'SET_WIDGET_BAND_STATS';
const SET_WIDGET_LAYERGROUPS = 'SET_WIDGET_LAYERGROUPS';
const SET_WIDGET_ZOOM = 'SET_WIDGET_ZOOM';
const SET_WIDGET_LATLNG = 'SET_WIDGET_LATLNG';
const GET_WIDGET_FAVORITE = 'GET_WIDGET_FAVORITE';

/**
 * STORE
 */
const initialState = {
  data: {}, // Actual widget
  dataset: {}, // Dataset associated with the widget
  bandDescription: null, // Description of the band if a raster widget
  bandStats: {}, // Stats about the band if a raster widget
  layerGroups: [], // LayerGroups for the map widgets
  zoom: 3,
  latLng: { lat: 0, lng: 0 },
  loading: true, // Are we loading the data?
  error: null, // An error was produced while loading the data
  favourite: {
    id: null,
    favourited: false
  }
};

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_WIDGET_LOADING: {
      const widget = {
        loading: true,
        error: null
      };
      return Object.assign({}, state, widget);
    }

    case GET_WIDGET_SUCCESS: {
      const widget = {
        loading: false,
        error: null
      };
      return Object.assign({}, state, widget);
    }

    case GET_WIDGET_ERROR: {
      const widget = {
        loading: false,
        error: action.payload
      };
      return Object.assign({}, state, widget);
    }

    case SET_WIDGET_DATA: {
      const widget = {
        data: action.payload
      };
      return Object.assign({}, state, widget);
    }

    case SET_WIDGET_DATASET: {
      const widget = {
        dataset: action.payload
      };
      return Object.assign({}, state, widget);
    }

    case SET_WIDGET_BAND_DESCRIPTION: {
      const widget = {
        bandDescription: action.payload
      };
      return Object.assign({}, state, widget);
    }

    case SET_WIDGET_BAND_STATS: {
      const widget = {
        bandStats: action.payload
      };
      return Object.assign({}, state, widget);
    }

    case SET_WIDGET_LAYERGROUPS: {
      const widget = {
        layerGroups: action.payload
      };
      return Object.assign({}, state, widget);
    }

    case SET_WIDGET_ZOOM: {
      return Object.assign({}, state, { zoom: action.payload });
    }

    case SET_WIDGET_LATLNG: {
      return Object.assign({}, state, { latLng: action.payload });
    }

    case GET_WIDGET_FAVORITE: {
      return Object.assign({}, state, {
        favourite: Object.assign({}, state.favourite, action.payload)
      });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Fetch the dataset and set the dataset attribute
 * of the state
 * NOTE: returns when the state is updated
 * @param {string} datasetId
 * @returns {Promise<void>}
 */
function fetchDataset(datasetId) {
  return (dispatch, getState) => {
    const state = getState();
    const datasetService = new DatasetService(datasetId, {
      apiURL: process.env.WRI_API_URL,
      language: state.common.locale
    });

    return datasetService.fetchData('metadata')
      .then(dataset => dispatch({ type: SET_WIDGET_DATASET, payload: dataset }));
  };
}

/**
 * Get the information of band of a raster dataset
 * @param {string} datasetId Dataset ID
 * @param {string} bandName Name of the band
 */
function fetchRasterBandInfo(datasetId, bandName) {
  return (dispatch, getState) => new Promise(async (resolve) => {
    try {
      if (isEmpty(getState().widget.dataset)) {
        await dispatch(fetchDataset(datasetId));
      }

      const dataset = getState().widget.dataset.attributes;

      // We don't need the "else" for the following conditions
      // because the band information is not vital and also because
      // it's not mandatory
      let { metadata } = dataset;
      if (metadata && metadata.length) {
        metadata = metadata[0].attributes;
        const { columns } = metadata;

        if (columns[bandName] && columns[bandName].description) {
          dispatch({ type: SET_WIDGET_BAND_DESCRIPTION, payload: columns[bandName].description });
        }
      }

      const { provider, tableName } = dataset;
      const rasterService = new RasterService(datasetId, tableName, provider);
      const bandStats = await rasterService.getBandStatsInfo(bandName);
      dispatch({ type: SET_WIDGET_BAND_STATS, payload: bandStats });
      resolve();
    } catch (err) {
      // We can't use Toastr here because an embed doesn't display a notification
      console.error(err);

      // Even if we failed to load some data, we still resolve because we can still
      // display the graph (only the additional info will be missing)
      resolve();
    }
  });
}
/**
 * Get the layer of a map widget
 * @param {string} datasetId Dataset ID
 * @param {string} layerId Layer ID
 */
function fetchLayer(datasetId, layerId) {
  return dispatch => new LayersService().fetchData({ id: layerId })
    .then((layer) => {
      const layerGroups = [{
        dataset: datasetId,
        visible: true,
        layers: [{
          active: true,
          ...layer
        }]
      }];
      dispatch({ type: SET_WIDGET_LAYERGROUPS, payload: layerGroups });
    });
}

export function setZoom(zoom) {
  return dispatch => dispatch({ type: SET_WIDGET_ZOOM, payload: zoom });
}

export function setLatLng(latLng) {
  return dispatch => dispatch({ type: SET_WIDGET_LATLNG, payload: latLng });
}

/**
 * Retrieve the list of widgets
 * @param {string} widgetId
 */
export function getWidget(widgetId, includes = '') {
  return (dispatch) => {
    dispatch({ type: GET_WIDGET_LOADING });
    const service = new WidgetService(widgetId, { apiURL: process.env.WRI_API_URL });
    return service.fetchData(includes)
      .then((data) => {
        dispatch({ type: SET_WIDGET_DATA, payload: data });
        return data;
      })
      .then((data) => {
        const { widgetConfig } = data.attributes;
        const isRaster = widgetConfig.paramsConfig
          && widgetConfig.paramsConfig.visualizationType === 'raster_chart';
        const isMap = widgetConfig.paramsConfig
          && widgetConfig.paramsConfig.visualizationType === 'map';

        if (isRaster) {
          const datasetId = data.attributes.dataset;
          const bandName = widgetConfig.paramsConfig.band.name;
          return dispatch(fetchRasterBandInfo(datasetId, bandName));
        }

        if (isMap) {
          const datasetId = data.attributes.dataset;
          const layerId = widgetConfig.paramsConfig && widgetConfig.paramsConfig.layer;
          const zoom = widgetConfig.zoom;
          const latLng = widgetConfig.lat && widgetConfig.lng
            && { lat: widgetConfig.lat, lng: widgetConfig.lng };

          if (zoom) dispatch(setZoom(zoom));
          if (latLng) dispatch(setLatLng(latLng));

          return dispatch(fetchLayer(datasetId, layerId));
        }

        return data;
      })
      .then(() => dispatch({ type: GET_WIDGET_SUCCESS }))
      .catch((err) => {
        dispatch({ type: GET_WIDGET_ERROR, payload: err.message });
      });
  };
}

/**
 * Event handler executed when the user toggles the
 * visibility of a layer group
 * @param {LayerGroup} layerGroup - Layer group to toggle
 */
export function toggleLayerGroupVisibility(layerGroup) {
  return (dispatch, getState) => {
    const layerGroups = getState().widget.layerGroups.map((l) => {
      if (l.dataset !== layerGroup.dataset) return l;
      return Object.assign({}, l, { visible: !layerGroup.visible });
    });

    dispatch({ type: SET_WIDGET_LAYERGROUPS, payload: [...layerGroups] });
  };
}

/**
 * Set the favourited attribute of the store
 * @export
 * @param {string} widgetId  Widget ID
 * @param {{ id: string, token: string }?} user  Widget ID
 */

export function checkIfFavorited(widgetId) {
  return (dispatch, getState) => {
    const { user } = getState();

    if (!user.id) {
      dispatch({ type: GET_WIDGET_FAVORITE, payload: { id: null, favourited: false } });
    } else {
      const userService = new UserService({ apiURL: process.env.WRI_API_URL });
      userService.getFavouriteWidgets(user.token)
        .then((res) => {
          const favourite = res.find && res.find(elem => elem.attributes.resourceId === widgetId);

          dispatch({
            type: GET_WIDGET_FAVORITE,
            payload: {
              id: favourite ? favourite.id : null,
              favourited: !!favourite
            }
          });
        });
    }
  };
}

/**
 * Set if the wiget is favourited or not
 * @export
 * @param {string} widgetId Widget ID
 * @param {boolean} toFavorite Whether to make it favourite or not
 */
export function setIfFavorited(widgetId, toFavorite) {
  return (dispatch, getState) => {
    const { user, widget } = getState();

    // If the user is not logged in, we just return
    if (!user.id) return;

    const userService = new UserService({ apiURL: process.env.WRI_API_URL });

    // We have an optimistic approach: we tell the user the action
    // is already done, and if it fails, we rever it
    dispatch({ type: GET_WIDGET_FAVORITE, payload: { favourited: toFavorite } });

    if (toFavorite) {
      userService.createFavourite('widget', widgetId, user.token)
        .then(res => dispatch({ type: GET_WIDGET_FAVORITE, payload: { id: res.data.id } }))
        .catch(() => dispatch({ type: GET_WIDGET_FAVORITE, payload: { id: null } }));
    } else {
      const id = widget.favourite.id;

      userService.deleteFavourite(id, user.token)
        .then(() => dispatch({ type: GET_WIDGET_FAVORITE, payload: { id: null } }))
        .catch(() => dispatch({ type: GET_WIDGET_FAVORITE, payload: { id } }));
    }
  };
}

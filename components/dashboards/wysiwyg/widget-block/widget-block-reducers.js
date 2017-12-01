import * as actions from './widget-block-actions';

const defaultWidget = {
  widget: {},
  widgetLoading: false,
  widgetError: null,
  widgetType: 'vega',

  // Layers
  layers: [],
  layersLoading: false,
  layersError: null,

  // Favourites
  favourite: {},
  favouriteLoading: false,
  favouriteError: null
};


export default {
  [actions.setWidget]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      widget: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.setWidgetLoading]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      widgetLoading: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.setWidgetError]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      widgetError: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.setWidgetType]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      widgetType: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.removeWidget]: (state, action) => {
    if (!action.payload.id) return state;

    delete state[action.payload.id];
    return state;
  },

  [actions.setLayers]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      layers: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.setLayersLoading]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      layersLoading: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.setLayersError]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      layersError: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.setFavourite]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      favourite: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.setFavouriteLoading]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      favouriteLoading: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  },

  [actions.setFavouriteError]: (state, action) => {
    if (!action.payload.id) return state;

    const widget = {
      ...defaultWidget,
      ...state[action.payload.id],
      favouriteError: action.payload.value
    };
    return { ...state, [action.payload.id]: widget };
  }

};

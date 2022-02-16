import { getWidgetType } from 'utils/widget';

// these list are used to populate the query params of the embed URLS according to the widget type
const ALLOWED_QUERY_PARAMS_MAP_WIDGETS = ['aoi', 'type', 'geostore_env', 'geostore_id'];

const ALLOWED_QUERY_PARAMS_MAPS_SWIPE_WIDGETS = ['aoi', 'type', 'geostore_env', 'geostore_id'];

const ALLOWED_QUERY_PARAMS_CHART_WIDGETS = ['geostore_env', 'geostore_id', 'country'];

export const isLoadedExternally = () => {
  if (typeof document === 'undefined' || document.referrer === '') return false;

  return !/localhost|(staging\.)?resourcewatch.org/.test(document.referrer);
};

export const getLinksByWidgetType = (widget = {}, params = {}) => {
  const { id } = widget;

  const widgetType = getWidgetType(widget);

  let queryParamsFilter = ALLOWED_QUERY_PARAMS_CHART_WIDGETS;

  if (widgetType === 'map-swipe') {
    queryParamsFilter = ALLOWED_QUERY_PARAMS_MAPS_SWIPE_WIDGETS;
  }

  if (widgetType === 'map') queryParamsFilter = ALLOWED_QUERY_PARAMS_MAP_WIDGETS;

  const validParams = Object.keys(params)
    .filter((paramKey) => queryParamsFilter.includes(paramKey))
    .reduce(
      (prev, validParamKey) => ({
        ...prev,
        [validParamKey]: params[validParamKey],
      }),
      {},
    );

  const queryParams = new URLSearchParams(validParams);

  return {
    link: `${window.location.origin}/data/widget/${id}${
      queryParams.toString().length ? `?${queryParams.toString()}` : ''
    }`,
    embed: `${window.location.origin}/embed/${widgetType}/${id}${
      queryParams.toString().length ? `?${queryParams.toString()}` : ''
    }`,
  };
};

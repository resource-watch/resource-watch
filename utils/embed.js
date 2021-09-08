// these list are used to populate the query params of the embed URLS according to the widget type
const ALLOWED_QUERY_PARAMS_MAP_WIDGETS = [
  'aoi',
  'type',
];

const ALLOWED_QUERY_PARAMS_CHART_WIDGETS = [
  'geostore_env',
  'geostore_id',
];

export const isLoadedExternally = () => {
  if (typeof document === 'undefined' || document.referrer === '') return false;

  return !/localhost|(staging\.)?resourcewatch.org/.test(document.referrer);
};

export const getLinksByWidgetType = (widget = {}, params = {}) => {
  const {
    id,
    widgetConfig,
  } = widget;
  const {
    type,
  } = widgetConfig || {};

  let queryParamsFilter = ALLOWED_QUERY_PARAMS_CHART_WIDGETS;

  if (type === 'map') queryParamsFilter = ALLOWED_QUERY_PARAMS_MAP_WIDGETS;

  const validParams = Object.keys(params)
    .filter((paramKey) => queryParamsFilter.includes(paramKey))
    .reduce((prev, validParamKey) => ({
      ...prev,
      [validParamKey]: params[validParamKey],
    }), {});

  const queryParams = new URLSearchParams(validParams);

  return ({
    link: `${window.location.origin}/embed/${(type || 'widget')}/${id}${queryParams.toString().length ? `?${queryParams.toString()}` : ''}`,
    embed: `${window.location.origin}/embed/${(type || 'widget')}/${id}${queryParams.toString().length ? `?${queryParams.toString()}` : ''}`,
  });
};

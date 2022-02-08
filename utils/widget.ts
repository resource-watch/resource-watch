import { replace } from '@vizzuality/layer-manager-utils';

import type { APIWidgetSpec, WidgetConfig, WidgetTypes } from 'types/widget';

export const isMapWidget = (widgetConfig = {} as WidgetConfig) =>
  'type' in widgetConfig && widgetConfig.type === 'map';

export const isMapSwipeWidget = (widgetConfig = {} as WidgetConfig) =>
  isMapWidget(widgetConfig) &&
  'layersLeft' in (widgetConfig.paramsConfig || {}) &&
  'layersRight' in (widgetConfig.paramsConfig || {});

export const isRankingWidget = (widgetConfig = {} as WidgetConfig) =>
  'type' in widgetConfig && widgetConfig.type === 'ranking';

// Some widgets have not been created with the widget editor
// so the paramsConfig attribute doesn't exist
export const isEmbedWidget = (widgetConfig = {} as WidgetConfig) =>
  !!(
    widgetConfig &&
    ((widgetConfig.paramsConfig && widgetConfig.paramsConfig.visualizationType === 'embed') ||
      // Case of a widget created outside of the widget editor
      (widgetConfig.type && widgetConfig.type === 'embed'))
  );

// The widgets that are created through the widget editor
// don't have any "type" attribute
export const isTextualWidget = (widgetConfig = {} as WidgetConfig) =>
  'type' in widgetConfig && widgetConfig.type === 'text';

export const hasValidConfiguration = (widget = {} as APIWidgetSpec): boolean => {
  // checks widgetConfig attribute is present
  if (!Object.prototype.hasOwnProperty.call(widget, 'widgetConfig')) return false;

  // checks widgetConfig is undefined or null
  if (!widget.widgetConfig || widget.widgetConfig === null) return false;

  // checks widgetConfig attribute is not an object (discards Number, String, etc...)
  if (!(widget.widgetConfig instanceof Object)) return false;

  // checks widgetConfig attribute is an array
  // (Array type is still an Object so we need to double-check)
  if (widget.widgetConfig instanceof Array) return false;

  return true;
};

export const getParametrizedWidget = (
  widget: APIWidgetSpec,
  params: Record<string, string | number> = {},
  encode = true,
): APIWidgetSpec => ({
  ...widget,
  name: replace(widget.name, params),
  widgetConfig: {
    ...(widget?.widgetConfig || {}),
    data: (widget?.widgetConfig?.data || []).map((_data) => {
      if (!_data?.url) return _data;

      return {
        ..._data,
        url: encode ? window.encodeURI(replace(_data.url, params)) : replace(_data.url, params),
      };
    }),
  },
});

export const getWidgetType = (widget: APIWidgetSpec): WidgetTypes => {
  if (!widget) throw new Error('getWidgetType: widget not found');

  const { widgetConfig } = widget;

  if (isMapSwipeWidget(widgetConfig)) return 'map-swipe';

  if (isMapWidget(widgetConfig)) return 'map';

  if (isEmbedWidget(widgetConfig)) return 'embed';

  if (isRankingWidget(widgetConfig)) return 'ranking';

  return 'widget';
};

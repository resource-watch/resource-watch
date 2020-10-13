export const isMapWidget = (widgetConfig = {}) => 'type' in widgetConfig && widgetConfig.type === 'map';

// Some widgets have not been created with the widget editor
// so the paramsConfig attribute doesn't exist
export const isEmbedWidget = (widgetConfig = {}) => !!(widgetConfig
  && (
    (
      widgetConfig.paramsConfig
      && widgetConfig.paramsConfig.visualizationType === 'embed'
    )
    || (
      // Case of a widget created outside of the widget editor
      widgetConfig.type
      && widgetConfig.type === 'embed'
    )
  )
);

// The widgets that are created through the widget editor
// don't have any "type" attribute
export const isTextualWidget = (widgetConfig = {}) => 'type' in widgetConfig && widgetConfig.type === 'text';

export const hasValidConfiguration = (widget = {}) => {
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

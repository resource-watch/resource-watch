export const isMapWidget = (widgetConfig = {}) =>
  'type' in widgetConfig && widgetConfig.type === 'map';

export const isEmbedWidget = (widgetConfig = {}) =>
  !!(widgetConfig
    // Some widgets have not been created with the widget editor
    // so the paramsConfig attribute doesn't exist
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

export const isTextualWidget = (widgetConfig = {}) =>
  // The widgets that are created through the widget editor
  // don't have any "type" attribute
  'type' in widgetConfig && widgetConfig.type === 'text';

export default {
  isMapWidget,
  isEmbedWidget,
  isTextualWidget
};

import { AdapterModifier } from '@widget-editor/widget-editor';
import RWAdapter from '@widget-editor/rw-adapter';

// constants
import {
  WIDGET_EDITOR_DEFAULT_THEME,
} from 'constants/widget-editor';

export const getRWAdapter = (config = {}) => AdapterModifier(RWAdapter, {
  endpoint: process.env.WRI_API_URL,
  env: process.env.API_ENV,
  applications: process.env.APPLICATIONS.split(','),
  ...config,
});

/**
 * Return the theme of the vega chart
 * @param {boolean} [thumbnail=false]
 * @return {object}
 */
export const getDefaultTheme = (thumbnail = false) => {
  let theme = WIDGET_EDITOR_DEFAULT_THEME;

  if (thumbnail) {
    // removes the configuration of each of the axes
    delete theme.axis_x;
    delete theme.axis_y;
    // hides the axes and their ticks and labels
    theme = {
      ...theme,
      axis: {
        ticks: 0,
        tickSize: 0,
        axisWidth: 0,
        tickLabelFontSize: 0,
      },
    };
  }

  return theme;
};

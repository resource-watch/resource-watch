import deepClone from 'lodash/cloneDeep';

const defaultTheme = {
  height: 0, // Don't touch this without testing all the charts
  // and particularly the bar chart with or without
  // scrolling and its vertical alignment
  padding: 'auto', // Do not set something different than 'auto'
  // because it will break several graphs
  // (primarly the bar and pie ones)
  render: {
    retina: true
  },
  marks: {
    color: '#1f77b4'
  },
  axis_x: {
    axisColor: '#A9ABAD',
    tickSize: 8,
    ticks: 8,
    tickColor: '#A9ABAD',
    tickLabelColor: '#717171',
    tickLabelFont: 'Lato',
    tickLabelFontSize: 13
  },
  axis_y: {
    axisWidth: 0,
    tickSize: 0,
    ticks: 5,
    tickLabelColor: '#717171',
    tickLabelFont: 'Lato',
    tickLabelFontSize: 13,
    grid: true,
    gridColor: '#A9ABAD',
    gridOpacity: 1
  }
};

/**
 * Return the theme of the vega chart
 * @param {boolean} [thumbnail=false]
 * @return {object}
 */
export default function (thumbnail = false) {
  const theme = deepClone(defaultTheme);

  if (thumbnail) {
    // We remove the configuration of each of
    // the axes
    delete theme.axis_x;
    delete theme.axis_y;

    // We hide the axes and their ticks and
    // labels
    theme.axis = {
      ticks: 0,
      tickSize: 0,
      axisWidth: 0,
      tickLabelFontSize: 0
    };
  }

  return theme;
}

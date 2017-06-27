import deepClone from 'lodash/cloneDeep';

const defaultTheme = {
  width: 400,
  height: 200,
  autopadInset: 10,
  marks: {
    color: '#3BB2D0'
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
    orient: 'right',
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
 * @param {{ chart: string }}
 * @return {object}
 */
export default function () {
  const theme = deepClone(defaultTheme);

  // Change here the default theme if you need to
  // The name of the chart get passed in the parameter

  return theme;
}

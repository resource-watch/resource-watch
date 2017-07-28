import deepClone from 'lodash/cloneDeep';

const defaultTheme = {
  height: 0, // Don't touch this without testing all the charts
             // and particularly the bar chart with or without
             // scrolling and its vertical alignment
  padding: 'auto', // Do not set something different than 'auto'
                   // because it will break several graphs
                   // (primarly the bar and pie ones)
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
  },
  // This is used by old widgets, generally the one that are
  // used to represent a dataset
  range: {
    colorRange1: [
      '#3bb2d0',
      '#54d2f2',
      '#54bad4',
      '#2a8da5'
    ],
    colorRange2: [
      '#f4f4f1',
      '#fffbca',
      '#ffe01b',
      '#f6bb0f',
      '#f6811d',
      '#e24e2c'
    ],
    colorRange3: [
      '#D23782',
      '#1230a5',
      '#32866d',
      '#ffe01b',
      '#6e23bd'
    ]
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

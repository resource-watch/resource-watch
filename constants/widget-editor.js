export const WIDGET_EDITOR_DEFAULT_DISABLED_FEATURES = [
  'typography',
  'end-user-filters',
];

export const WIDGET_EDITOR_COLOUR_SCHEMES = [
  {
    name: 'Resource Watch',
    mainColor: '#40B2CE',
    category: [
      '#40B2CE',
      '#2E75AD',
      '#F9B746',
      '#ED4A4D',
      '#68B631',
      '#C22E7A',
      '#F478B7',
      '#63D2B9',
      '#F0812D',
      '#9E1D0D',
      '#A7E9E3',
      '#BAD771',
      '#393F44',
      '#CACCD0',
      '#717171',
    ],
  },
  {
    name: 'WRI',
    mainColor: '#F0AB00',
    category: [
      '#F0AB00',
      '#0099CC',
      '#C51F24',
      '#97BD3D',
      '#7D0063',
      '#007A4D',
      '#003F6A',
      '#E98300',
      '#ED1A37',
      '#FCD900',
      '#434242',
      '#5E5E5D',
      '#767575',
      '#919191',
      '#B7B7B7',
    ],
  },
];

export const WIDGET_EDITOR_DEFAULT_THEME = {
  height: 0, // Don't touch this without testing all the charts
  // and particularly the bar chart with or without
  // scrolling and its vertical alignment
  padding: 'auto', // Do not set something different than 'auto'
  // because it will break several graphs
  // (primarily the bar and pie ones)
  render: {
    retina: true,
  },
  marks: {
    color: '#1f77b4',
  },
  axis_x: {
    axisColor: '#A9ABAD',
    tickSize: 8,
    ticks: 8,
    tickColor: '#A9ABAD',
    tickLabelColor: '#717171',
    tickLabelFont: 'Lato',
    tickLabelFontSize: 13,
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
    gridOpacity: 1,
  },
};

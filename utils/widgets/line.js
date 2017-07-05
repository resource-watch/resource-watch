import deepClone from 'lodash/cloneDeep';

/* eslint-disable */
const defaultChart = {
  data: [
    {
      name: 'table'
    }
  ],
  scales: [
    {
      name: 'x',
      type: 'linear',
      range: 'width',
      zero: false,
      domain: { data: 'table', field: 'x' }
    },
    {
      name: 'y',
      type: 'linear',
      range: 'height',
      zero: false,
      nice: true,
      domain: { data: 'table', field: 'y' }
    }
  ],
  axes: [
    { type: 'x', scale: 'x', ticks: 6 },
    { type: 'y', scale: 'y' }
  ],
  marks: [
    {
      type: 'line',
      from: { data: 'table' },
      properties: {
        enter: {
          interpolate: { value: 'linear' },
          x: { scale: 'x', field: 'x' },
          y: { scale: 'y', field: 'y' },
          y2: { scale: 'y', value: 0 },
          "strokeWidth": {"value": 2}
        }
      }
    }
  ]
};

/**
 * Return the Vega chart configuration
 * 
 * @export
 * @param {any} { columns, data } 
 */
export default function ({ columns, data }) {
  const config = deepClone(defaultChart);

  // We set the URL of the dataset
  config.data[0].url = data.url;
  config.data[0].format = {
    "type": "json",
    "property": data.property
  };

  // If the x column is a date, we need to use a
  // temporal x scale and parse the x column as a date
  if (columns.x.type === 'date') {
    // We update the scale
    const xScale = config.scales.find(scale => scale.name === 'x');
    xScale.type = 'utc';

    // We parse the x column as a date
    config.data[0].format.parse = { x: 'date' };
  }

  return config;
};

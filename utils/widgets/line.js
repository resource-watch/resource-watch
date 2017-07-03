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
      nice: true,
      domain: { data: 'table', field: 'y' }
    }
  ],
  axes: [
    { type: 'x', scale: 'x', ticks: 20 },
    { type: 'y', scale: 'y' }
  ],
  marks: [
    {
      type: 'line',
      from: { data: 'table' },
      properties: {
        enter: {
          interpolate: { value: 'monotone' },
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

  return config;
};

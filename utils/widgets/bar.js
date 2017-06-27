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
      type: 'ordinal',
      range: 'width',
      domain: { data: 'table', field: 'x' }
    },
    {
      name: 'y',
      type: 'linear',
      range: 'height',
      domain: { data: 'table', field: 'y' },
      nice: true
    }
  ],
  axes: [
    { type: 'x', scale: 'x' },
    { type: 'y', scale: 'y' }
  ],
  marks: [
    {
      type: 'rect',
      from: { data: 'table' },
      properties: {
        enter: {
          x: { scale: 'x', field: 'x' },
          width: { scale: 'x', band: true, offset: -1 },
          y: { scale: 'y', field: 'y' },
          y2: { scale: 'y', value: 0 }
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

  if (columns.color.present) {
    // We add the color scale
    config.scales.push({
      "name": "c",
      "type": "ordinal",
      "domain": {"data": "table", "field": "color"},
      "range": "category10"
    });

    // We update the marks
    config.marks[0].properties.enter.fill = {
      "scale": "c",
      "field": "color"
    };
  }

  return config;
};

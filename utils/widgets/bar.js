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
      nice: true,
      zero: false
    }
  ],
  axes: [
    {
      "type": "x",
      "scale": "x",
      "tickSizeEnd": 0,
      "offset": 5,
      "properties": {
        "axis": {
          "strokeWidth": { "value": 0 }
        }
      }
    },
    {
      "type": "y",
      "scale": "y",
      "tickSizeEnd": 0,
      "offset": 5,
      "properties": {
        "axis": {
          "strokeWidth": { "value": 0 }
        }
      }
    }
  ],
  marks: [
    {
      type: 'rect',
      from: { data: 'table' },
      properties: {
        enter: {
          x: { scale: 'x', field: 'x' },
          width: { scale: 'x', band: true, offset: -3 },
          y: { scale: 'y', field: 'y' },
          "y2": {"field": {"group": "height"}}
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

  // If the x column is a date, we need to use a
  // a temporal x axis and parse the x column as a date
  if (columns.x.type === 'date') {
    // We update the axis
    const xAxis = config.axes.find(axis => axis.type === 'x');
    xAxis.formatType = 'time';

    // We parse the x column as a date
    config.data[0].format.parse = { x: 'date' };
  }

  return config;
};

import deepClone from 'lodash/cloneDeep';

/* eslint-disable */
const defaultChart = {
  "data": [{
    "name": "table"
  }],

  "scales": [
    {
      "name": "x",
      "type": "linear",
      "domain": {"data": "table", "field": "x"},
      "range": "width",
      "zero": false
    },
    {
      "name": "y",
      "type": "linear",
      "domain": [0, 2],
      "range": "height"
    }
  ],

  "axes": [
    {"type": "x", "scale": "x"}
  ],

  "marks": [
    {
      "type": "rule",
      "from": {"data": "table"},
      "properties": {
        "enter": {
          "x": {"scale": "x", "field": "x"},
          "y": {"scale": "y", "value": 0.5},
          "y2": {"scale": "y", "value": 1.5},
          "strokeWidth": {"value": 1},
          "strokeOpacity": {"value": 0.5}
        }
      }
    }
  ]
};

/**
 * Return the Vega chart configuration
 *
 * @export
 * @param {any} { columns, data, url, embedData }
 */
export default function ({ columns, data, url, embedData }) {
  const config = deepClone(defaultChart);

  if (embedData) {
    // We directly set the data
    config.data[0].values = data;
  } else {
    // We set the URL of the dataset
    config.data[0].url = url;
    config.data[0].format = {
      "type": "json",
      "property": "data"
    };
  }

  // We add the name of the axis
  const xAxis = config.axes.find(a => a.type === 'x');
  xAxis.name = columns.x.name;

  if (columns.color.present) {
    // We add the color scale
    config.scales.push({
      "name": "c",
      "type": "ordinal",
      "domain": {"data": "table", "field": "color"},
      "range": "category10"
    });

    // We update the marks
    config.marks[0].properties.enter.stroke = {
      "scale": "c",
      "field": "color"
    };
  }

  if (columns.size.present) {
    // We add the scale
    config.scales.push({
      "name": "s",
      "type": "linear",
      "domain": {"data": "table", "field": "size"},
      "range": [1, 5],
      "zero": false
    });

    // We update the marks
    config.marks[0].properties.enter.strokeWidth = {
      "scale": "s",
      "field": "size"
    };
  }

  return config;
};

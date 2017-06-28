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
      "domain": {"data": "table", "field": "y"},
      "range": "height",
      "nice": true,
      "zero": false
    }
  ],

  "axes": [
    {"type": "x", "scale": "x"},
    {"type": "y", "scale": "y"}
  ],

  "marks": [
    {
      "type": "symbol",
      "from": {"data": "table"},
      "properties": {
        "enter": {
          "x": {"scale": "x", "field": "x"},
          "y": {"scale": "y", "field": "y"},
          "fillOpacity": {"value": 0.5},
          "size": {"value": 60}
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

  if (columns.size.present) {
    // We add the scale
    config.scales.push({
      "name": "s",
      "type": "linear",
      "domain": {"data": "table", "field": "size"},
      "range": [10, 150],
      "zero": false
    });

    // We update the marks
    config.marks[0].properties.enter.size = {
      "scale": "s",
      "field": "size"
    };
  }

  return config;
};
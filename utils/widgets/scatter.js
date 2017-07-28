import deepClone from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';

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
  const yAxis = config.axes.find(a => a.type === 'y');
  xAxis.name = columns.x.name;
  yAxis.name = columns.y.name;

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
    const sizeScaleType = 'linear';
    const sizeScaleRange = [10, 150];
    // The following formula comes from:
    // https://github.com/vega/vega-scenegraph/blob/master/src/path/symbols.js#L10
    const getCircleRadius = (d) => Math.sqrt(d) / 2;

    // We add the scale
    config.scales.push({
      "name": "s",
      "type": sizeScaleType,
      "domain": {"data": "table", "field": "size"},
      "range": sizeScaleRange,
      "zero": false
    });

    // We update the marks
    config.marks[0].properties.enter.size = {
      "scale": "s",
      "field": "size"
    };

    // We add a legend to explain what the size
    // variation means
    const sizeDate = data.map(d => d.size);
    config.legend = [
      {
        type: 'size',
        label: columns.size.alias || columns.size.name,
        shape: 'circle',
        scale: sizeScaleType,
        values: [
          {
            label: Math.max(...sizeDate),
            value: getCircleRadius(sizeScaleRange[1])
          },
          {
            label: Math.min(...sizeDate),
            value: getCircleRadius(sizeScaleRange[0])
          }
        ]
      }
    ];
  }

  // If all the dots have the exact same y position,
  // the chart won't have any height
  // To fix that, we force the domain of the y scale
  // to be around the value
  const oneYValue = data.length && data.every(d => d.y === data[0].y);
  if (data.length === 1 || oneYValue) {
    const yScale = config.scales.find(scale => scale.name === 'y');

    // The step is 20% of the value
    const step = data[0].y * 0.2;
    
    // We fix the domain around the value
    yScale.domain = [data[0].y - step, data[0].y + step];
  }

  return config;
};
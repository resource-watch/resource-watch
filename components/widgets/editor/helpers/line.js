import deepClone from 'lodash/cloneDeep';

// Helpers
import { getTimeFormat } from 'components/widgets/editor/helpers/WidgetHelper';

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

  // If the x column is a date, we need to use a
  // temporal x scale and parse the x column as a date
  if (columns.x.type === 'date') {
    // We update the scale
    const xScale = config.scales.find(scale => scale.name === 'x');
    xScale.type = 'utc';

    // We parse the x column as a date
    if (!config.data[0].format) config.data[0].format = {};
    config.data[0].format.parse = { x: 'date' };

    // We make the axis use temporal ticks
    xAxis.formatType = 'time';

    // We compute an optimal format for the ticks
    const temporalData = data.map(d => d.x);
    const format = getTimeFormat(temporalData);
    if (format) xAxis.format = format;
  }

  // If all the "dots" have the exact same y position,
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

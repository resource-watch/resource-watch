import deepClone from 'lodash/cloneDeep';

// Helpers
import { getTimeFormat } from 'components/widgets/editor/helpers/WidgetHelper';

/* eslint-disable */
const defaultChart = {
  width: 1,
  height: 1,
  data: [
    {
      name: 'table'
    },
    {
      "name": "layout",
      "source": "table",
      "transform": [
        {
          "type": "aggregate",
          "summarize": [{"field": "x","ops": ["distinct"]}]
        },
        {
          "type": "formula",
          "field": "width",
          "expr": "(datum[\"distinct_x\"] + 1) * 25"
        },
        {"type": "formula","field": "height","expr": "300"}
      ]
    }
  ],
  // This scale is not the one used by the marks
  // but is necessary for the tooltip to show
  scales: [
    {
      name: 'x',
      type: 'ordinal',
      range: 'width',
      domain: { data: 'table', field: 'x' },
      real: false
    },
    {
      name: 'y',
      type: 'linear',
      "rangeMin": 300,
      "rangeMax": 0,
      domain: { data: 'table', field: 'y' },
      real: false
    }
  ],
  // This axis is not used by the marks
  // but is necessary for the tooltip to show
  axes: [
    {
      "type": "x",
      "scale": "x",
      "ticks": 0,
      "tickSize": 0,
      "properties": {
        "labels": {
          "text": {"template": ""},
        }
      }
    },
    {
      "type": "y",
      // We don't care about any value below but
      // Vega requires a scale to be defined
      "scale": "y",
      "ticks": 0,
      "tickSize": 0,
      "properties": {
        "labels": {
          "text": {"template": ""},
        }
      }
    }
  ],
  marks: [
    {
      "type": "group",
      "from": {"data": "layout"},
      "properties": {
        "update": {
          "width": {"field": "width"},
          "height": {"field": "height"}
        }
      },
      "marks": [
        {
          type: 'rect',
          from: { data: 'table' },
          properties: {
            enter: {
              xc: { scale: 'x', field: 'x' },
              width: { scale: 'x', band: true, offset: -15 },
              y: { scale: 'y', field: 'y' },
              "y2": {"field": {"group": "height"}}
            }
          }
        }
      ],
       scales: [
        {
          name: 'x',
          type: 'ordinal',
          range: 'width',
          domain: { data: 'table', field: 'x' },
          "bandSize": 25,
          "round": true,
          "points": true,
          "padding": 1
        },
        {
          name: 'y',
          type: 'linear',
          "rangeMin": 300,
          "rangeMax": 0,
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
            },
            "labels": {
              "text": {"template": "{{ datum[\"data\"] | truncate:25 }}"},
              "angle": {"value": 270},
              "align": {"value": "right"},
              "baseline": {"value": "middle"}
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
      ]
    }
  ]
};

/**
 * Return the Vega chart configuration
 *
 * @export
 * @param {any} { columns, data, url, embedData, provider, band }
 */
export default function ({ columns, data, url, embedData, provider, band  }) {
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

    // If the dataset is a raster one, we save the provider and the
    // band in the config so we can later re-render the chart
    // correctly (we need the info to parse the data)
    if (provider && band) {
      config.data[0].format = { provider, band };
    }
  }

  // We add the name of the axis
  // NOTE: we reduce the scope of the variables to
  // not interfere with the variables designating
  // the "real" axis
  {
    const xAxis = config.axes.find(a => a.type === 'x');
    const yAxis = config.axes.find(a => a.type === 'y');
    xAxis.name = columns.x.alias || columns.x.name;
    yAxis.name = columns.y.alias || columns.y.name;
  }

  if (columns.color.present) {
    // We add the color scale
    config.scales.push({
      "name": "c",
      "type": "ordinal",
      "domain": {"data": "table", "field": "color"},
      "range": "category10"
    });

    // We update the marks
    config.marks[0].marks[0].properties.enter.fill = {
      "scale": "c",
      "field": "color"
    };
  }

  // If the x column is a date, we need to use a
  // a temporal x axis and parse the x column as a date
  if (columns.x.type === 'date') {
    // We update the axis
    const xAxis = config.marks[0].axes.find(axis => axis.type === 'x');
    xAxis.formatType = 'time';

    // We parse the x column as a date
    if (!config.data[0].format) config.data[0].format = {};
    config.data[0].format.parse = { x: 'date' };

    // We compute an optimal format for the ticks
    const temporalData = data.map(d => d.x);
    const format = getTimeFormat(temporalData);
    if (format) xAxis.format = format;

    // The x axis has a template used to truncate the
    // text. Nevertheless, when using it, a date will
    // be displayed as a timestamp.
    // One solution is just to remove the template
    // and Vega will use d3 to determine the best format
    // or the provided format if we have access to the
    // data.
    // In such a case, we don't truncate the tick, but
    // it shouldn't be necessary because usually the
    // result is short.
    // NOTE: actually if we just remove the template,
    // "text" will be an empty object and Vega won't
    // display any tick, so we need to remove text
    // instead
    delete xAxis.properties.labels.text;
  }

  // In case the dataset contains only one value (thus one)
  // column, Vega fails to render the chart:
  // https://github.com/vega/vega/issues/927
  // The same happens if all the bars have the same height
  // As a temporary solution, we force domain of the scale
  // to be around the value
  const oneYValue = data.length && data.every(d => d.y === data[0].y);
  if (data.length === 1 || oneYValue) {
    const yScale = config.marks[0].scales.find(scale => scale.name === 'y');

    // The step is 20% of the value
    const step = data[0].y * 0.2;

    // We fix the domain around the value
    yScale.domain = [data[0].y - step, data[0].y + step];
  }

  return config;
};

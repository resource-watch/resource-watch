import deepClone from 'lodash/cloneDeep';

// Helpers
import { getTimeFormat } from 'utils/widgets/WidgetHelper';

/* eslint-disable */
const defaultChart = {
  width: 1,
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
        }
      ]
    },
    {
      "name": "stats",
      "source": "table",
      "transform": [
        {
          "type": "aggregate",
          "summarize": [{"field": "y", "ops": ["min"]}]
        }
      ]
    }
  ],
  scales: [
    // This scale is not used by the chart but is needed
    // for the following x axis
    {
      name: 'x',
      type: 'ordinal',
      range: 'width',
      domain: { data: 'table', field: 'x' },
      real: false
    },
    // This scale is used by the chart
    {
      name: 'y',
      type: 'linear',
      "range": "height",
      domain: { data: 'table', field: 'y' }
    }
  ],
  // These two following axes are not used by the marks
  // but are necessary for the tooltip to show
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
      "scale": "y",
      "tickSizeEnd": 0,
      "offset": 5,
      "properties": {"axis": {"strokeWidth": {"value": 0}}}
    }
  ],
  marks: [
    {
      "type": "group",
      "from": {"data": "layout"},
      "properties": {
        "update": {
          "width": {"field": "width"}
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
              "y2": {"scale": "y", "value": 0}
            }
          }
        },
        // This rule is conditional: when all the values are positive,
        // it is hidden so we don't have two lines at the bottom of
        // the chart (the rule + the axis), but when at least one value
        // is negative, it is displayed to mark the "0"
        {
          "type": "rule",
          "from": {"data": "stats"},
          "properties": {
            "enter": {
              "y": {"scale": "y", "value": "0"},
              "x": {"value": "0"},
              "x2": {"field": {"group": "width"}},
              "stroke": {"value": "#A9ABAD"},
              "strokeWidth": {"value": 1},
              "opacity": [
                {
                  "test": "datum.min_y < 0",
                  "value": 1
                },
                {"value": 0}
              ]
            }
          }
        },
        {
          "type": "group",
          "properties": {
            "update": {
              "y": {"signal": "height", "offset": 5}
            }
          },
          "axes": [
            {
              "type": "x",
              "scale": "x",
              "tickSizeEnd": 0,
              "properties": {
                "axis": {"strokeWidth": {"value": 0}},
                "labels": {
                  "text": {
                    "template": "{{ datum[\"data\"] | truncate:25 }}"
                  },
                  "angle": {"value": 270},
                  "align": {"value": "right"},
                  "baseline": {"value": "middle"}
                }
              }
            }
          ]
        }
      ],
      // This scale is real and is based on the computed width
      "scales": [
        {
          "name": "x",
          "type": "ordinal",
          "range": "width",
          "domain": {"data": "table","field": "x"},
          "bandSize": 25,
          "round": true,
          "points": true,
          "padding": 1
        }
      ],
      // This axis is necessary here because the top level one
      // doesn't have any width so the horizontal grid doesn't show
      "axes": [
        {
          "type": "y",
          "scale": "y",
          "tickSizeEnd": 0,
          "offset": 5,
          "properties": {"axis": {"strokeWidth": {"value": 0}}},
          "grid": "true"
        }
      ]
    }
  ],
  interaction_config: [
    {
      "name": "tooltip",
      "config": {
        "fields": [
          {
            "key": "x",
            "label": "x",
            "format": ".2f"
          },
          {
            "key": "y",
            "label": "y",
            "format": ".2s"
          }
        ]
      }
    }
  ]
};

/**
 * Return the Vega chart configuration
 *
 * @export
 * @param {any} { columns, data, url, embedData, provider, band, templateMode }
 */
export default function ({ columns, data, url, embedData, provider, band, templateMode  }) {
  const config = deepClone(defaultChart);

  // Simple template used in the advanced mode of the editor
  if (templateMode) return config;

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

  // We save the name of the columns for the tooltip
  {
    const xField = config.interaction_config[0].config.fields[0];
    const yField = config.interaction_config[0].config.fields[1];
    xField.label = columns.x.alias || columns.x.name;
    yField.label = columns.y.alias || columns.y.name;
  }

  // If the x column is a date, we need to use a
  // a temporal x axis and parse the x column as a date
  if (columns.x.type === 'date') {
    // We update the axis
    const xAxis = config.marks[0].marks[2].axes[0];
    xAxis.formatType = 'time';

    // We parse the x column as a date
    if (!config.data[0].format) config.data[0].format = {};
    config.data[0].format.parse = { x: 'date' };

    // We compute an optimal format for the ticks
    const temporalData = data.map(d => d.x);
    const format = getTimeFormat(temporalData);
    if (format) xAxis.format = format;

    // We also set the format for the tooltip
    config.interaction_config[0].config.fields[0].format = format;

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
  } else if (columns.x.type === 'number') {
    const allIntegers = data.length && data.every(d => parseInt(d.x, 10) === d.x);
    if (allIntegers) {
      const xField = config.interaction_config[0].config.fields[0];
      xField.format = '';
    }
  }

  // In case the dataset contains only one value (thus one)
  // column, Vega fails to render the chart:
  // https://github.com/vega/vega/issues/927
  // The same happens if all the bars have the same height
  // As a temporary solution, we force domain of the scale
  // to be around the value
  const oneYValue = data.length && data.every(d => d.y === data[0].y);
  if (data.length === 1 || oneYValue) {
    const yScale = config.scales[1];

    // The step is 20% of the value
    const step = data[0].y * 0.2;

    // We fix the domain around the value
    yScale.domain = [data[0].y - step, data[0].y + step];
  }

  return config;
};

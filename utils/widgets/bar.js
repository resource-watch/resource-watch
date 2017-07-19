import deepClone from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';

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
      domain: { data: 'table', field: 'x' }		
    }
  ],
  // This axis is not used by the marks
  // but is necessary for the tooltip to show
  axes: [
    {
      "type": "x",
      "scale": "x",
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
 * @param {any} { columns, data } 
 */
export default function ({ columns, data }) {
  const config = deepClone(defaultChart);
  // Whether we have access to the data instead
  // of having its URL
  const hasAccessToData = isArray(data);

  if (hasAccessToData) {
    // We directly set the data
    config.data[0].values = data;
  } else {
    // We set the URL of the dataset
    config.data[0].url = data.url;
    config.data[0].format = {
      "type": "json",
      "property": data.property
    };
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
    config.data[0].format.parse = { x: 'date' };

    // The x axis has a template used to truncate the
    // text. Nevertheless, when using it, a date will
    // be displayed as a timestamp.
    // One solution could be to change the template to
    // format the string, but we don't know in which
    // format the date should be displayed so we can't
    // use it.
    // The other solution is just to remove the template
    // and Vega will use d3 to determine the best format.
    // In such a case, we don't truncate the tick, but
    // it shouldn't be necessary because usually the
    // result is short.
    // NOTE: actually if we just remove the template,
    // "text" will be an empty object and Vega won't
    // display any tick, so we need to remove text
    // instead
    delete xAxis.properties.labels.text;
  }

  return config;
};

import deepClone from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import { scale } from 'd3';

/* eslint-disable */
const defaultChart = {
  "width": 1,
  "height": 1,
  "data": [
    {
      "name": "table"
    }
  ],
  "scales": [
    {
      "name": "r",
      "type": "sqrt",
      "domain": {"data": "table", "field": "y"},
      "range": [20, 100]
    },
    {
      "name": "c",
      "type": "ordinal",
      "domain": {"data": "table", "field": "x"},
      // If you update this range, don't forget to
      // update the code below
      "range": "category20"
    }
  ],
  // This axis is not used by the marks
  // but is necessary for the tooltip to show
  axes: [
    {
      "type": "x",
      "scale": "r",
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
      "scale": "r",
      "ticks": 0,
      "tickSize": 0,
      "properties": {
        "labels": {
          "text": {"template": ""},
        }
      }
    }
  ],
  "marks": [
    {
      "type": "arc",
      "from": {"data": "table"},
      "properties": {
        "enter": {
          "x": {"field": {"group": "width"}, "mult": 0.5},
          "y": {"field": {"group": "height"}, "mult": 0.5},
          "startAngle": {"field": "layout_start"},
          "endAngle": {"field": "layout_end"},
          "innerRadius": {"value": 20},
          "outerRadius": {"value": 150},
          "fill": {"scale": "c", "field": "x"}
        }
      }
    }
    // If everyone's ok having the value displayed in the
    // legend instead of on the chart, we can permanently
    // delete the following bit
    // {
    //   "type": "text",
    //   "from": {"data": "table"},
    //   "properties": {
    //     "enter": {
    //       "x": {"field": {"group": "width"}, "mult": 0.5},
    //       "y": {"field": {"group": "height"}, "mult": 0.5},
    //       "radius": {"value": 110},
    //       "theta": {"field": "layout_mid"},
    //       "fill": {"value": "#000"},
    //       "align": {"value": "center"},
    //       "baseline": {"value": "middle"},
    //       "text": {"field": "x"},
    //       "opacity": {"value": 0.6}
    //     }
    //   }
    // }
  ]
}

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

  config.data[0].transform = [{
    "type": "pie", "field": "y"
  }];

  // We add the name of the axis
  // We don't have real x and y axis for the pie
  // chart but we use them for the tooltip
  const xAxis = config.axes.find(a => a.type === 'x');
  const yAxis = config.axes.find(a => a.type === 'y');
  xAxis.name = columns.x.name;
  yAxis.name = columns.y.name;

  if (columns.color.present) {
    const colorScale = config.scales.find(scale => scale.name === 'c');
    colorScale.domain.field = 'color';
  }

  if (columns.size.present) {
    // We add the scale
    config.scales.push({
      "name": "s",
      "type": "sqrt",
      "domain": {"data": "table", "field": "size"},
      "range": [10, 150],
      "zero": false
    });

    const arcMark = config.marks.find(mark => mark.type === 'arc');
    arcMark.properties.enter.outerRadius = {
      "scale": "s",
      "field": "size"
    };

    const textMark = config.marks.find(mark => mark.type === 'text');
    textMark.properties.enter.radius = {
      "scale": "s",
      "field": "size",
      "offset": 10
    }
  }

  // We add a default legend to the chart
  // In the default template above, category20 is used
  if (hasAccessToData) {
    const colorRange = scale.category20().range();
    config.legend = [
      {
        type: 'color',
        label: null,
        shape: 'square',
        values: data.map((d, i) => ({ label: d.x, value: colorRange[i % 20] }))
      }
    ];
  }

  return config;
};

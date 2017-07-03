import deepClone from 'lodash/cloneDeep';

/* eslint-disable */
const defaultChart = {
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
      "range": "category20"
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
    },
    {
      "type": "text",
      "from": {"data": "table"},
      "properties": {
        "enter": {
          "x": {"field": {"group": "width"}, "mult": 0.5},
          "y": {"field": {"group": "height"}, "mult": 0.5},
          "radius": {"value": 110},
          "theta": {"field": "layout_mid"},
          "fill": {"value": "#000"},
          "align": {"value": "center"},
          "baseline": {"value": "middle"},
          "text": {"field": "x"},
          "opacity": {"value": 0.6}
        }
      }
    }
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

  // We set the URL of the dataset
  config.data[0].url = data.url;
  config.data[0].format = {
    "type": "json",
    "property": data.property,
  };
  config.data[0].transform = [{
    "type": "pie", "field": "y"
  }];

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

  return config;
};

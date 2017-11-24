import deepClone from 'lodash/cloneDeep';
import { scale } from 'd3';

/* eslint-disable */
const defaultChart = {
  "data": [
    {
      "name": "table",
      "transform": [
        {"type": "rank"}
      ]
    },
    {
      "name": "count",
      "source": "table",
      "transform": [
        {
          "type": "aggregate",
          "summarize": {"y": "count"}
        }
      ]
    },
    {
      "name": "others",
      "source": "table",
      "transform": [
        {
          "type": "cross",
          "with": "count"
        },
        {
          "type": "filter",
          "test": "datum.b.count_y < 20 || datum.a.rank >= 20"
        },
        {
          "type": "aggregate",
          "summarize": [
            {
              "field": "a.y",
              "ops": ["sum"],
              "as": ["sum"]
            }
          ]
        }
      ]
    },
    {
      "name": "slices",
      "source": "table",
      "transform": [
        {
          "type": "filter",
          "test": "datum.rank <= 20"
        },
        {
          "type": "cross",
          "with": "others"
        },
        {
          "type": "formula",
          "field": "x",
          "expr": "datum.a.rank < 20 ? datum.a.x : 'Others'"
        },
        {
          "type": "formula",
          "field": "y",
          "expr": "datum.a.y + (datum.a.rank === 20 ? datum.b.sum : 0)"
        },
        {
          "type": "pie",
          "field": "y"
        },
        {
          "type": "formula",
          "field": "maxRadius",
          "expr": "(height > width ? width : height) / 2"
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "c",
      "type": "ordinal",
      "domain": {"data": "slices", "field": "x"},
      // If you update this range, don't forget to
      // update the code below
      "range": "category20"
    }
  ],
  "marks": [
    {
      "type": "arc",
      "from": {"data": "slices"},
      "properties": {
        "enter": {
          "x": {"field": {"group": "width"}, "mult": 0.5},
          "y": {"field": {"group": "height"}, "mult": 0.5},
          "startAngle": {"field": "layout_start"},
          "endAngle": {"field": "layout_end"},
          "innerRadius": [
            {
              "test": "datum.maxRadius > 150",
              "value": 20
            },
            {"value": 10}
          ],
          "outerRadius": [
            {
              "test": "datum.maxRadius > 150",
              "value": 150
            },
            {"field": "maxRadius"}
          ],
          "fill": {"scale": "c", "field": "x"}
        }
      }
    }
  ],
  interaction_config: [
    {
      "name": "tooltip",
      "config": {
        "fields": [
          {
            "key": "x",
            "label": "x"
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
}

/**
 * Return the Vega chart configuration
 *
 * @export
 * @param {any} { columns, data, url, embedData, templateMode }
 */
export default function ({ columns, data, url, embedData, templateMode }) {
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
  }

  // We save the name of the columns for the tooltip
  {
    const xField = config.interaction_config[0].config.fields[0];
    const yField = config.interaction_config[0].config.fields[1];
    xField.label = columns.x.alias || columns.x.name;
    yField.label = columns.y.alias || columns.y.name;
  }

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
  const colorRange = scale.category20().range();
  const values = data.slice(0, 20)
    .map((d, i) => ({ label: i === 19 ? 'Others' : d.x, value: colorRange[i % 20], type: columns.x.type }));

  config.legend = [
    {
      type: 'color',
      label: null,
      shape: 'square',
      values
    }
  ];

  return config;
};

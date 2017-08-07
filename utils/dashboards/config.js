// Temporarily hard-coded list of dashboards
// Needs to be updated so the widgets can be shared between various
// dashboards instead of copying them.

/* eslint-disable */
export default [
  {
    name: 'Water',
    slug: 'water',
    summary: 'Water is vital to the natural and manmade systems of our planet. Understanding global water challenges requires timely, relevant information about the many factors that impact water quantity and quality, the health of freshwater ecosystems, and access to safe water sources.',
    photo: 'static/images/dashboards/dashboard-water.jpg',
    widgets: [
      {
        widgetId: '6f01a91e-bb68-4d10-9da4-e48b553193f3',
        categories: ['Water', 'Cities'],
      },
      {
        name: 'Countries that will experience the greatest increase in projected water stress in the year 2040 if we continue business as usual',
        categories: ['Water', 'Society'],
        data: {
          attributes: {
            widgetConfig: {
              "height":300,
              "padding": {"top": 25,"left": 0,"bottom": 30,"right": 0},
              "data": [
                {
                  "name": "table",
                  "url": "https://wri-rw.carto.com/api/v2/sql?q=SELECT country, values, iso, row_number() over (order by values desc) as rank FROM aqueduct_water_stress_country_ranking_bau where type = 'all' and year = '2040' and values!=0 order by values desc",
                  "format": {"type": "json","property": "rows"},
                  "transform": [{"type": "sort","by": "rank"}]
                },
                {
                  "name": "max",
                  "source": "table",
                  "transform": [{"type": "aggregate","summarize": {"rank": ["max"]}}]
                },
                {
                  "name": "head",
                  "source": "table",
                  "transform": [
                    {
                      "type": "cross",
                      "with": "max",
                      "filter": "datum.a.rank===datum.b.max_rank || datum.a.rank<=10"
                    },
                    {"type": "sort","by": "a.rank"} 
                  ]
                }
              ],
              "scales": [
                {
                  "name": "bar",
                  "type": "linear",
                  "range": "width",
                  "domain": {"data": "table","field": "values"}
                },
                {
                  "name": "vertical_head",
                  "type": "ordinal",
                  "range": "height",
                  "domain": {
                    "data": "head",
                    "field": "a.rank"
                  }
                }
              ],
              "marks": [
                {
                  "type": "text",
                  "from": {"data": "head"},
                  "properties": {
                    "enter": {
                      "x": {"value": 20},
                      "y": {"field": "a.rank","scale": "vertical_head"},
                      "text": {
                        "template": "{{datum.a.rank}}.- {{datum.a.country}}"
                      },
                      "baseline": {"value": "middle"},
                      "fontSize": {"value": 13},
                      "fill": {"value": "#555555"},
                      "align": {"value": "left"}
                    }
                  }
                },
                {
                  "name": "head",
                  "type": "rect",
                  "from": {"data": "head"},
                  "properties": {
                    "enter": {
                      "x":{"field": {"group": "width"},"mult": 0.35},
                      "width":{"scale": "bar", "field": "a.values","mult": 0.5},
                      "y": {
                        "field": "a.rank",
                        "scale": "vertical_head",
                        "offset": -6
                      },
                      "height": {"value": 10},
                      "fillOpacity": {"value": 1}
                    }
                  }
                }   
              ]
            }
          }
        }
      },
      {
        widgetId: '04b1610b-74ef-413b-b167-3a0169f77b3f',
        categories: ['Water', 'Food']
      },
      {
        categories: ['Water', 'Forests'],
        widgetId: '42756e3f-2c35-4d28-a221-47b0751380f7',
      },
      {
        widgetId: 'aac54e4e-4133-4127-8a4f-643db2429248',
        categories: ['Water', 'Forests']
      },
      {
        widgetId: '73c574b9-f9ab-4f77-87be-651ff8dac5fe',
        categories: ['Water', 'Biodiversity', 'Climate']
      },
      {
        widgetId: '7cdad4dc-0074-4bd4-b3bd-db6ffc4e0180',
        categories: ['Water', 'Disasters', 'Society'],
      }
    ]
  },
  /* The following dashboard is not a real one, but instead a link to the old
   * country dashboard */
  {
    name: 'Countries',
    slug: 'countries',
    photo: 'static/images/dashboards/dashboard-Cities.jpg',
    widgets: [{}]
  },
  // {
  //   name: 'Cities',
  //   slug: 'cities',
  //   summary: '',
  //   photo: 'static/images/dashboards/dashboard-Cities.jpg',
  //   widgets: []
  // },
  // {
  //   name: 'Society',
  //   slug: 'society',
  //   summary: '',
  //   photo: 'static/images/dashboards/dashboard-Society.jpg',
  //   widgets: []
  // },
  // {
  //   name: 'Food',
  //   slug: 'food',
  //   summary: '',
  //   photo: 'static/images/dashboards/dashboard-Food.jpg',
  //   widgets: []
  // },
  // {
  //   name: 'Energy',
  //   slug: 'energy',
  //   summary: '',
  //   photo: 'static/images/dashboards/dashboard-Energy.jpg',
  //   widgets: []
  // },
  // {
  //   name: 'Forests',
  //   slug: 'forests',
  //   summary: '',
  //   photo: 'static/images/dashboards/dashboard-Forests.jpg',
  //   widgets: []
  // },
  // {
  //   name: 'Biodiversity',
  //   slug: 'biodiversity',
  //   summary: '',
  //   photo: 'static/images/dashboards/dashboard-Biodiversity.jpg',
  //   widgets: []
  // },
  // {
  //   name: 'Climate',
  //   slug: 'climate',
  //   summary: '',
  //   photo: 'static/images/dashboards/dashboard-Climate.jpg',
  //   widgets: []
  // },
  // {
  //   name: 'Disasters',
  //   slug: 'disasters',
  //   summary: '',
  //   photo: 'static/images/dashboards/dashboard-Disasters.jpg',
  //   widgets: []
  // }
];
/* eslint-enable */

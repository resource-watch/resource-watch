import React from 'react';
import classnames from 'classnames';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import TextChart from 'components/widgets/TextChart';
import VegaChart from 'components/widgets/VegaChart';

// Utils
import getChartTheme from 'utils/widgets/theme';

// Temporarily hard-code the list of dashboards
// Needs to be updated so the widgets can be shared between various
// dashboards instead of copying them.
/* eslint-disable */
const DASHBOARDS = [
  {
    name: 'Water',
    slug: 'water',
    description: 'Topic description lorem ipsum casius tesebe Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odi em sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    image: 'static/images/dashboards/dashboard-water.jpg',
    widgets: [
      {
        name: 'Cities with > 1,000,000 people in high water risk areas',
        categories: ['Water', 'Cities'],
        data: {
          attributes: {
            widgetConfig: {
              type: 'text',
              data: {
                url: 'https://api.resourcewatch.org/v1/query/6d99441e-5faa-4c61-967f-01c9fe60624b?sql=SELECT count(*) over () total, (count(*) Filter (where _default>=4) over ()) as n_cities,  (100*(count(*) Filter (where _default>=4) over ())/(count(*) over ()))::numeric perc  FROM water_plus_cities limit 1'
              },
              template: '{{n_cities}} or {{perc}} ({{n_cities}}/{{total}}) of cities with 1,000,000 people or more are in high water risk areas',
              params_config: [],
              template_config: [
                { key: 'n_cities' },
                { key: 'perc', suffix: '%' },
                { key: 'total' }
              ]
            }
          }
        }
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
        name: '% crop growing in high water risk areas by 2040',
        categories: ['Water', 'Food']
      },
      {
        name: '% of power plants exposed to water risk',
        categories: ['Water', 'Energy']
      },
      {
        name: 'Watersheds are at risk due to deforestation',
        categories: ['Water', 'Forests'],
        data: {
          attributes: {
            widgetConfig: {
              "padding": {"top": 0,"left": 0,"right": 0,"bottom": 0},
              "data": [
                {
                  "url": "https://wri-rw.carto.com/api/v2/sql?q=SELECT count(rs_tl_c) x, rs_tl_c as y FROM river_basins where rs_tl_c != 10  group by rs_tl_c",
                  "name": "table",
                  "format": {"type": "json","property": "rows"}
                },
                {
                  "from":"table",
                  "name": "pie",
                  "transform": [{"type": "pie","field": "x"}]
                }
              ],
              "marks": [
                {
                  "from": {
                    "data": "table",
                    "transform": [{"type": "pie","field": "x"}]
                  },
                  "type": "arc",
                  "properties": {
                    "enter": {
                      "x": {"mult": 0.5,"field": {"group": "width"}},
                      "y": {"mult": 0.5,"field": {"group": "height"}},
                      "fill": {"field": "x","scale": "color"},
                      "stroke": {"value": "white"},
                      "endAngle": {"field": "layout_end"},
                      "startAngle": {"field": "layout_start"},
                      "innerRadius": {"value": 45},
                      "outerRadius": {"value": 65}
                    }
                  }
                }
              ],
              "scales": [
                {
                  "name": "color",
                  "type": "ordinal",
                  "range": "category20c",
                  "domain": {"data": "table","field": "x_percent"}
                }
              ]
            }
          }
        }
      },
      {
        name: 'Watersheds are at risk due to erosion',
        categories: ['Water', 'Forests']
      },
      {
        name: 'Bleaching events are bad and are increasingly likely to happen',
        categories: ['Water', 'Biodiversity', 'Climate']
      },
      {
        name: 'Population at risk of flooding in 1/50 year events in 2030',
        categories: ['Water', 'Disasters', 'Society'],
        data: {
          attributes: {
            widgetConfig: {
              type: 'text',
              data: {
                url: 'https://api.resourcewatch.org/v1/query/01ddff59-8cbc-4420-8c0d-9d8317a63292?sql=SELECT round(sum(p30_24_50)/1000000) people FROM aqueduct_global_flood_risk_data_by_country_20150304'
              },
              template: '{{people}} of people affected by floods for 1/50 year storm events in 2030',
              params_config: [],
              template_config: [
                { key: 'people', suffix: ' millions' }
              ]
            }
          }
        }
      },
      {
        name: 'Surface water is changing over time',
        categories: ['Water']
      }
    ]
  },
  {
    name: 'Cities',
    slug: 'cities',
    description: '',
    image: 'static/images/dashboards/dashboard-Cities.jpg',
    widgets: []
  },
  {
    name: 'Society',
    slug: 'society',
    description: '',
    image: 'static/images/dashboards/dashboard-Society.jpg',
    widgets: []
  },
  {
    name: 'Food',
    slug: 'food',
    description: '',
    image: 'static/images/dashboards/dashboard-Food.jpg',
    widgets: []
  },
  {
    name: 'Energy',
    slug: 'energy',
    description: '',
    image: 'static/images/dashboards/dashboard-Energy.jpg',
    widgets: []
  },
  {
    name: 'Forests',
    slug: 'forests',
    description: '',
    image: 'static/images/dashboards/dashboard-Forests.jpg',
    widgets: []
  },
  {
    name: 'Biodiversity',
    slug: 'biodiversity',
    description: '',
    image: 'static/images/dashboards/dashboard-Biodiversity.jpg',
    widgets: []
  },
  {
    name: 'Climate',
    slug: 'climate',
    description: '',
    image: 'static/images/dashboards/dashboard-Climate.jpg',
    widgets: []
  },
  {
    name: 'Disasters',
    slug: 'disasters',
    description: '',
    image: 'static/images/dashboards/dashboard-Disasters.jpg',
    widgets: []
  }
];
/* eslint-enable */

class Dashboards extends Page {

  constructor(props) {
    super(props);
    this.state = {
      // List of dashboards
      dashboards: [],
      // Pointer to the selected dashboard
      selectedDashboard: null,
      // Whether to show all the dashboards or just a few
      showMore: false
    };
  }

  componentWillMount() {
    this.getDashboards();
  }

  /**
   * Event handler executed when a different dashboard is selected
   * @param {string} slug Slug of the selected dashboard
   */
  onChangeDashboard(slug) {
    this.setState({
      selectedDashboard: this.state.dashboards.find(dashboard => dashboard.slug === slug)
    });
  }

  /**
   * Fetch the dashboards, save them in the state and set a default
   * selected dashboard
   */
  getDashboards() {
    const dashboards = DASHBOARDS;

    this.setState({
      dashboards,
      selectedDashboard: dashboards[0]
    });
  }

  render() {
    return (
      <Layout
        title="Dashboards"
        description="Resource Watch Dashboards"
        url={this.props.url}
        user={this.props.user}
        pageHeader
      >
        <div className="c-page-dashboards">

          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="page-header-content -padding-b-2">
                <Breadcrumbs items={[{ name: 'Data', route: 'data' }]} />
                <Title className="-primary -huge page-header-title">Dashboards</Title>
              </div>
            </div>
          </div>

          <div className="info">
            <div className="row">
              <div className="column small-12">
                <ul className="dashboards-list">
                  {
                    this.state.dashboards
                      .map(dashboard => (
                        <li
                          className={classnames({
                            '-active': this.state.selectedDashboard === dashboard,
                            '-disabled': !dashboard.widgets.length
                          })}
                          key={dashboard.slug}
                          style={{ backgroundImage: `url(${dashboard.image})` }}
                        >
                          <input
                            type="radio"
                            name="dashboard"
                            id={`dashboard-${dashboard.slug}`}
                            value={dashboard.slug}
                            checked={this.state.selectedDashboard === dashboard}
                            disabled={!dashboard.widgets.length}
                            onChange={e => this.onChangeDashboard(e.target.value)}
                          />
                          <label className="content" htmlFor={`dashboard-${dashboard.slug}`}>
                            {dashboard.name}
                          </label>
                        </li>
                      ))
                      .slice(0, this.state.showMore ? this.state.dashboards.length : 5)
                  }
                  <li className="-toggle">
                    <button
                      type="button"
                      className="content"
                      onClick={() => this.setState({ showMore: !this.state.showMore })}
                    >
                      <span>{ this.state.showMore ? 'Close' : 'More' }</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="column small-12 large-7 dashboard-info">
                <Title className="-extrabig -secondary">{this.state.selectedDashboard.name}</Title>
                <p className="description">
                  {this.state.selectedDashboard.description}
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="column small-12 widgets-list">
              {
                this.state.selectedDashboard.widgets.map(widget => (
                  <div className="c-dashboard-card" key={widget.name}>
                    <header>
                      <Title className="-default">{widget.name}</Title>
                      <ul className="categories">
                        {widget.categories.map(category => <li key={category}>{category}</li>)}
                      </ul>
                    </header>
                    <div className="widget-container">
                      { widget.data
                        && widget.data.attributes.widgetConfig.type === 'text'
                        && <TextChart widgetConfig={widget.data.attributes.widgetConfig} />
                      }
                      { widget.data
                        && widget.data.attributes.widgetConfig.type !== 'text'
                        && <VegaChart data={widget.data.attributes.widgetConfig} theme={getChartTheme()} />
                      }
                      { !widget.data
                       && <div className="no-data"><span>No data</span></div>
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

        </div>
      </Layout>
    );
  }

}

export default Dashboards;

import React from 'react';
import classnames from 'classnames';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import TextChart from 'components/widgets/TextChart';

// Temporarily hard-code the list of dashboards
// Needs to be updated so the widgets can be shared between various
// dashboards instead of copying them.
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
        categories: ['Water', 'Society']
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
        categories: ['Water', 'Forests']
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

import React from 'react';
import classnames from 'classnames';

// Router
import { Router } from 'routes';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DashboardCard from 'components/app/dashboards/DashboardCard';

// Utils
import DASHBOARDS from 'utils/dashboards/config';

class DashboardsDetail extends Page {

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
  onChangeDashboard(slug, dash) {
    // The countries dashboard is still ran by the old
    // application, so the URL is different
    if (slug === 'countries') {
      window.location = '/countries';
      return;
    }

    const dashboards = dash || this.state.dashboards;

    // If we can't find the dashboard with the specified slug, we just
    // set the first dashboard as the active one
    const selectedDashboard = dashboards.find(dashboard => dashboard.slug === slug)
      || dashboards[0];

    this.setState({ selectedDashboard });

    // We update the URL anyway (only on the client)
    if (typeof window !== 'undefined') {
      Router.replaceRoute('dashboards_detail', { slug: selectedDashboard.slug });
    }
  }

  /**
   * Fetch the dashboards, save them in the state, set a default
   * selected dashboard and update the URL
   */
  getDashboards() {
    // We store the dashboards in the state
    const dashboards = DASHBOARDS;
    this.setState({ dashboards });

    // We set the dashboard associated with the slug
    this.onChangeDashboard(this.props.url.query.slug, dashboards);
  }

  render() {
    const dashboardName = this.state.selectedDashboard ? `${this.state.selectedDashboard.name} dashboard` : '–';
    return (
      <Layout
        title={dashboardName}
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
                <Breadcrumbs items={[{ name: 'Dashboards', route: 'dashboards' }]} />
                <Title className="-primary -huge page-header-title">
                  {dashboardName}
                </Title>
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
                          style={{ backgroundImage: `url(/${dashboard.image})` }}
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
                  <DashboardCard
                    key={widget.name || widget.widgetId}
                    widgetId={widget.widgetId}
                    categories={widget.categories}
                    // The following attributes will be deprecated once all the
                    // widgets are fetched from the API
                    name={widget.name}
                    data={widget.data}
                  />
                ))
              }
            </div>
          </div>

        </div>
      </Layout>
    );
  }

}

export default DashboardsDetail;

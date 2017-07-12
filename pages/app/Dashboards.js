import React from 'react';
import classnames from 'classnames';

// Router
import { Router } from 'routes';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';

// Utils
import DASHBOARDS from 'utils/dashboards/config';

class Dashboards extends Page {

  constructor(props) {
    super(props);
    this.state = {
      // List of dashboards
      dashboards: []
    };
  }

  componentWillMount() {
    this.getDashboards();
  }

  /**
   * Event handler executed when a dashboard is selected
   * @param {string} slug Slug of the selected dashboard
   */
  static onChangeDashboard(slug) {
    Router.pushRoute('dashboards_detail', { slug });
  }

  /**
   * Fetch the dashboards and save them in the state
   */
  getDashboards() {
    // We store the dashboards in the state
    const dashboards = DASHBOARDS;
    this.setState({ dashboards });
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
                            disabled={!dashboard.widgets.length}
                            onChange={e => Dashboards.onChangeDashboard(e.target.value)}
                          />
                          <label className="content" htmlFor={`dashboard-${dashboard.slug}`}>
                            {dashboard.name}
                          </label>
                        </li>
                      ))
                  }
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="column small-12 large-7 dashboard-info">
                <Title className="-extrabig -secondary">Select a topic to start exploring</Title>
              </div>
            </div>
          </div>

        </div>
      </Layout>
    );
  }

}

export default Dashboards;

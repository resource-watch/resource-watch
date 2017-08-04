import React from 'react';

// Router
import { Router } from 'routes';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Spinner from 'components/ui/Spinner';

// Utils
import DASHBOARDS from 'utils/dashboards/config';

class Dashboards extends Page {

  /**
   * Fetch the list of dashboards
   * @static
   * @returns {Promise<{ name: string, slug: string, photo: string }[]>}
   */
  static async fetchDashboards() {
    return fetch(`${process.env.API_URL}/dashboards?fields[dashboards]=name,slug,photo`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Unable to fetch the dashboards');
      })
      .then(({ data }) => data.map(d => d.attributes));
  }

  constructor(props) {
    super(props);
    this.state = {
      // List of dashboards
      dashboards: [],
      // Whether we're loading the dashboards
      loading: false,
      // Error message
      error: null
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
    // The countries dashboard is still ran by the old
    // application, so the URL is different
    if (slug === 'countries') {
      window.location = '/countries';
      return;
    }

    Router.pushRoute('dashboards_detail', { slug });
  }

  /**
   * Fetch the dashboards and save them in the state
   */
  async getDashboards() {
    this.setState({ loading: true, error: null });

    try {
      const staticDashboards = DASHBOARDS;
      const dynamicDashboards = await Dashboards.fetchDashboards();
      this.setState({ dashboards: [...staticDashboards, ...dynamicDashboards] });
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ loading: false });
    }
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
                <Breadcrumbs items={[{ name: 'Data', href: '/data' }]} />
                <Title className="-primary -huge page-header-title">Dashboards</Title>
              </div>
            </div>
          </div>

          <div className="info">
            { this.state.loading && <Spinner isLoading className="-light" /> }
            <div className="row">
              <div className="column small-12">
                <ul className="dashboards-list">
                  {
                    this.state.dashboards
                      .map(dashboard => (
                        <li
                          key={dashboard.slug}
                          style={{ backgroundImage: dashboard.photo && (
                            dashboard.photo.startsWith('data:image/') ? `url(${dashboard.photo})` : `url(/${dashboard.photo})`
                          ) }}
                        >
                          <input
                            type="radio"
                            name="dashboard"
                            id={`dashboard-${dashboard.slug}`}
                            value={dashboard.slug}
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
              { this.state.error && (
                <div className="column small-12">
                  <p className="error">{this.state.error}</p>
                </div>
              ) }
              { !this.state.loading && !this.state.error && (
                <div className="column small-12 large-7 dashboard-info">
                  <Title className="-extrabig -secondary">Select a topic to start exploring</Title>
                </div>
              ) }
            </div>
          </div>

        </div>
      </Layout>
    );
  }

}

export default Dashboards;

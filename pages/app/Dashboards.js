import React from 'react';

// Router
import { Router } from 'routes';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
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

  /**
   * Return the URL of the dashboard image
   * NOTE: return null if no image
   * @static
   * @param {string|object} image
   */
  static getDashboardImageUrl(image) {
    if (!image) return null;

    if (typeof image === 'object') {
      // If no image has been uploaded, we just don't display anything
      if (/missing\.png$/.test(image.original)) return null;
      return `${process.env.STATIC_SERVER_URL}${image.original}`;
    } else if (typeof image === 'string') {
      return `/${image}`;
    }

    return null;
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
        className="page-dashboards"
        pageHeader
      >
        <div className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={[{ name: 'Data', href: '/data' }]} />
                  <h1>Dashboards</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="l-section -secondary">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                { this.state.error && (
                  <p className="error">{this.state.error}</p>
                ) }
                { !this.state.error && this.state.loading && <Spinner isLoading className="-light" /> }
                { !this.state.loading && !this.state.error && (
                  <h2>Select a topic to start exploring</h2>
                ) }
              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                <ul className="dashboards-list">
                  {
                    this.state.dashboards
                      .map(dashboard => (
                        <li
                          key={dashboard.slug}
                          style={{
                            backgroundImage: dashboard.photo
                              && Dashboards.getDashboardImageUrl(dashboard.photo)
                              && `url(${Dashboards.getDashboardImageUrl(dashboard.photo)})`
                          }}
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
          </div>
        </section>
      </Layout>
    );
  }
}

export default withRedux(initStore, null, null)(Dashboards);

import React from 'react';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getPublicDashboards } from 'redactions/dashboards';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Spinner from 'components/ui/Spinner';

class Dashboards extends Page {
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
  * COMPONENT LIFECYCLE
  * - componentDidMount
  */
  componentDidMount() {
    this.props.getPublicDashboards();
  }

  render() {
    const { dashboards, url, user } = this.props;

    console.log(dashboards.list);

    return (
      <Layout
        title="Dashboards"
        description="Resource Watch Dashboards"
        url={url}
        user={user}
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
                { dashboards.error && (
                  <p className="error">{dashboards.error}</p>
                ) }
                { !dashboards.error && dashboards.loading && <Spinner isLoading className="-light" /> }
                { !dashboards.loading && !dashboards.error && (
                  <h2>Select a topic to start exploring</h2>
                ) }
              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                <ul className="dashboards-list">
                  {
                    dashboards.list
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

const mapStateToProps = state => ({ dashboards: state.clientDashboards });

const mapDispatchToProps = dispatch => ({
  getPublicDashboards: bindActionCreators(getPublicDashboards, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Dashboards);

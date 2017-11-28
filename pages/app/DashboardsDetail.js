import React from 'react';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { fetchDashboard } from 'components/dashboards/detail/dashboard-detail-actions';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
// import DashboardCard from 'components/app/dashboards/DashboardCard';

import DashboardDetail from 'components/dashboards/detail/dashboard-detail';

class DashboardsDetail extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));

    await store.dispatch(fetchDashboard({ id: url.query.slug }));

    return { isServer, user, url };
  }

  componentDidMount() {
    // this.props.fetchDashboard({ id: this.props.url.query.slug });
  }

  render() {
    const { dashboard } = this.props.dashboardDetail;

    return (
      <Layout
        title={dashboard.name}
        description={dashboard.summary}
        url={this.props.url}
        user={this.props.user}
        pageHeader
        className="page-dashboards c-page-dashboards"
      >
        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={[{ name: 'Data', href: '/data' }]} />
                  <h1>{dashboard.name}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* <section className="l-section -secondary">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                {dashboards.loading && <Spinner isLoading className="-light" /> }
              </div>
            </div>

            { !!dashboards.list.length && <div className="row">
              <div className="column small-12">
                <ul className="dashboards-list">
                  {
                    dashboards.list.map(dashboard => (
                      <li
                        className={classnames({
                          '-active': selectedDashboard === dashboard
                        })}
                        key={dashboard.slug}
                        style={{
                          backgroundImage: dashboard.photo
                            && DashboardsDetail.getDashboardImageUrl(dashboard.photo)
                            && `url(${DashboardsDetail.getDashboardImageUrl(dashboard.photo)})`
                        }}
                      >
                        <input
                          type="radio"
                          name="dashboard"
                          id={`dashboard-${dashboard.slug}`}
                          value={dashboard.slug}
                          checked={selectedDashboard === dashboard}
                          onChange={e => DashboardsDetail.onChangeDashboard(e.target.value)}
                        />
                        <label className="content" htmlFor={`dashboard-${dashboard.slug}`}>
                          {dashboard.name}
                        </label>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div> }

            { dashboards.error && <div className="row">
              <div className="column small-12">
                { dashboards.error && (
                  <p className="error">{dashboards.error}</p>
                ) }
                { selectedDashboard && (
                  <div>
                    <h2>{selectedDashboard.name}</h2>
                    <p>{selectedDashboard.summary}</p>
                  </div>
                ) }
              </div>
            </div> }
          </div>
        </section> */}

        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <DashboardDetail />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  dashboardDetail: state.dashboardDetail
});

const mapDispatchToProps = {
  fetchDashboard
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DashboardsDetail);

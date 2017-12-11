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
import DashboardDetail from 'components/dashboards/detail/dashboard-detail';
import DashboardThumbnailList from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list';
import { fetchDashboards, setSelected, setExpanded, setPagination } from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list-actions';

class DashboardsDetail extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    await store.dispatch(setUser(user));
    store.dispatch(setRouter(url));

    await store.dispatch(fetchDashboard({ id: url.query.slug }));

    // We load the list of dashboards if not already done
    store.dispatch(setPagination(true));
    store.dispatch(setSelected(url.query.slug));

    const isDashboardPrivate = store.getState().dashboardDetail.dashboard.published;
    const thumbnailListLoaded = !!store.getState().dashboardThumbnailList.dashboards.length;
    if (isDashboardPrivate && !thumbnailListLoaded) {
      await store.dispatch(fetchDashboards({
        filters: { 'filter[published]': 'true' }
      }));
    }

    return { isServer, user, url };
  }

  render() {
    const { dashboardDetail } = this.props;

    return (
      <Layout
        title={dashboardDetail.dashboard.name}
        description={dashboardDetail.dashboard.summary}
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
                  <Breadcrumbs items={[{ name: 'Dashboards', href: '/data/dashboards' }]} />
                  <h1>{dashboardDetail.dashboard.name}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="l-section">
          {dashboardDetail.dashboard.published && (
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <DashboardThumbnailList
                    onSelect={({ slug }) => {
                      // We need to make an amendment to have this working
                      // Router.pushRoute('dashboards_detail', { slug });
                      window.location = `/data/dashboards/${slug}`;
                    }}
                    onExpand={(bool) => {
                      this.props.setExpanded(bool);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <DashboardDetail />
              </div>
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
  fetchDashboard,
  fetchDashboards,
  setSelected,
  setExpanded,
  setPagination
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DashboardsDetail);

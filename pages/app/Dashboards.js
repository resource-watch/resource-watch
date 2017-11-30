import React from 'react';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { fetchDashboards, setPagination, setExpanded } from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list-actions';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DashboardThumbnailList from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list';

class Dashboards extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));

    store.dispatch(setPagination(false));
    await store.dispatch(fetchDashboards({
      // filters: { 'filter[published]': 'true' }
    }));

    return { isServer, user, url };
  }


  render() {
    const { url, user } = this.props;

    return (
      <Layout
        title="Dashboards"
        description="Resource Watch Dashboards"
        className="page-dashboards"
        url={url}
        user={user}
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

        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <DashboardThumbnailList
                  onSelect={({ slug }) => {
                    // We need to make an amendment in the Wysiwyg to have this working
                    Router.pushRoute('dashboards_detail', { slug });
                  }}
                  onExpand={(bool) => {
                    this.props.setExpanded(bool);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = null;

const mapDispatchToProps = {
  fetchDashboards,
  setExpanded,
  setPagination
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Dashboards);

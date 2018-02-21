import React from 'react';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { fetchDashboards, setPagination, setExpanded, setAdd, setSelected } from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list-actions';

// Components
import Page from 'components/layout/page';
import Layout from 'components/app/layout/Layout';
import DashboardThumbnailList from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list';

class Dashboards extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Dashboard thumbnail list
    context.store.dispatch(setPagination(false));
    context.store.dispatch(setAdd(false));
    context.store.dispatch(setSelected(null));

    await context.store.dispatch(fetchDashboards({
      filters: { 'filter[published]': 'true' }
    }));

    return { ...props };
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
                    Router.pushRoute('dashboards_detail', { slug })
                      .then(() => {
                        window.scrollTo(0, 0);
                      });
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
  setPagination,
  setAdd,
  setSelected
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Dashboards);

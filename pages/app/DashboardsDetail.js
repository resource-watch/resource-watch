import React from 'react';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { fetchDashboard } from 'components/dashboards/detail/dashboard-detail-actions';

// Next
import { Router } from 'routes';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DashboardDetail from 'components/dashboards/detail/dashboard-detail';
import SimilarDatasets from 'components/app/explore/similar-datasets/similar-datasets';

class DashboardsDetail extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    await context.store.dispatch(fetchDashboard({ id: props.url.query.slug }));

    return { props };
  }

  handleTagSelected(tag, labels = ['TOPIC']) { // eslint-disable-line class-methods-use-this
    const tagSt = `["${tag.id}"]`;
    let treeSt = 'topics';
    if (labels.includes('TOPIC')) {
      treeSt = 'topics';
    } else if (labels.includes('GEOGRAPHY')) {
      treeSt = 'geographies';
    } else if (labels.includes('DATA_TYPE')) {
      treeSt = 'dataTypes';
    }

    Router.pushRoute('explore', { [treeSt]: tagSt });
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
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <DashboardDetail />
              </div>
            </div>
          </div>
        </div>
        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <SimilarDatasets
                  datasetIds={[]}
                  onTagSelected={this.handleTagSelected}
                />
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
  fetchDashboard
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DashboardsDetail);

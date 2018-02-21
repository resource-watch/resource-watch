import React from 'react';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { fetchDashboard } from 'components/dashboards/detail/dashboard-detail-actions';
import { fetchDashboards, setPagination, setAdd, setSelected, setExpanded } from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list-actions';

// Next
import { Router } from 'routes';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import Page from 'components/layout/page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';
import Icon from 'components/ui/Icon';

import DashboardDetail from 'components/dashboards/detail/dashboard-detail';
import DashboardThumbnailList from 'components/dashboards/thumbnail-list/dashboard-thumbnail-list';
import SimilarDatasets from 'components/app/explore/similar-datasets/similar-datasets';

// Modal
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

class DashboardsDetail extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Dashboard detail
    await context.store.dispatch(
      fetchDashboard({
        id: props.url.query.slug
      })
    );

    // Dashboard thumbnail list
    const { user } = context.store.getState();

    context.store.dispatch(setPagination(false));
    context.store.dispatch(setAdd(!!user.token));
    context.store.dispatch(setSelected(props.url.query.slug));

    await context.store.dispatch(
      fetchDashboards({
        filters: { 'filter[published]': 'true' }
      })
    );

    return { ...props };
  }

  constructor(props) {
    super(props);

    this.state = {
      showShareModal: false
    };
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

  getDatasetIds() {
    const { dashboardDetail } = this.props;

    const content = JSON.parse(dashboardDetail.dashboard.content);

    const datasetIds = content.map((block) => {
      if (block.type === 'widget') {
        return block.content.datasetId;
      }

      if (block.type === 'grid') {
        return block.content.map((b) => {
          if (b.type === 'widget') {
            return b.content.datasetId;
          }

          return null;
        });
      }

      return null;
    });

    return compact(flatten(datasetIds));
  }

  handleToggleShareModal = (bool) => {
    this.setState({ showShareModal: bool });
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

                  <div className="page-header-info">
                    <ul>
                      <li>
                        <button className="c-btn -tertiary -alt -clean" onClick={() => this.handleToggleShareModal(true)}>
                          <Icon name="icon-share" className="-small" />
                          <span>Share</span>
                        </button>

                        <Modal
                          isOpen={this.state.showShareModal}
                          className="-medium"
                          onRequestClose={() => this.handleToggleShareModal(false)}
                        >
                          <ShareModal
                            links={{
                              link: typeof window !== 'undefined' && window.location.href,
                              embed: typeof window !== 'undefined' && `${window.location.origin}/embed/dashboard/${dashboardDetail.dashboard.slug}`
                            }}
                            analytics={{
                              facebook: () => logEvent('Share', `Share dashboard: ${dashboardDetail.dashboard.name}`, 'Facebook'),
                              twitter: () => logEvent('Share', `Share dashboard: ${dashboardDetail.dashboard.name}`, 'Twitter'),
                              copy: type => logEvent('Share', `Share dashboard: ${dashboardDetail.dashboard.name}`, `Copy ${type}`)
                            }}
                          />
                        </Modal>
                      </li>
                    </ul>
                  </div>

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
                <Title className="-extrabig -secondary -p-secondary">
                  Other dashboards
                </Title>

                <DashboardThumbnailList
                  onSelect={({ slug }) => {
                    // We need to make an amendment in the Wysiwyg to have this working
                    window.location = `/data/dashboards/${slug}`;
                  }}
                  onAdd={() => {
                    Router.pushRoute('myrw_detail', { tab: 'dashboards', id: 'new' })
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
        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <Title className="-extrabig -secondary -p-secondary">
                  Similar datasets
                </Title>

                <SimilarDatasets
                  datasetIds={this.getDatasetIds()}
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
  fetchDashboard,
  fetchDashboards,
  setExpanded,
  setPagination,
  setAdd,
  setSelected
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DashboardsDetail);

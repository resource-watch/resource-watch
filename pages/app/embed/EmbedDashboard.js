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
import Page from 'layout/page';
import LayoutEmbed from 'layout/layout/layout-embed';
import Icon from 'components/ui/Icon';

import DashboardDetail from 'components/dashboards/detail/dashboard-detail';

// Modal
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';


class EmbedDashboard extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Dashboard detail
    await context.store.dispatch(fetchDashboard({
      id: props.url.query.slug
    }));

    return { ...props };
  }

  constructor(props) {
    super(props);

    this.state = { showShareModal: false };
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

  handleToggleShareModal = (bool) => {
    this.setState({ showShareModal: bool });
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

  render() {
    const { dashboardDetail } = this.props;

    return (
      <LayoutEmbed
        title={dashboardDetail.dashboard.name}
        description={dashboardDetail.dashboard.summary}
        pageHeader
        className="page-dashboards c-page-dashboards"
      >
        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
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
                              facebook: () => logEvent('Share (embed)', `Share dashboard: ${dashboardDetail.dashboard.name}`, 'Facebook'),
                              twitter: () => logEvent('Share (embed)', `Share dashboard: ${dashboardDetail.dashboard.name}`, 'Twitter'),
                              copy: type => logEvent('Share (embed)', `Share dashboard: ${dashboardDetail.dashboard.name}`, `Copy ${type}`)
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
      </LayoutEmbed>
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedDashboard);

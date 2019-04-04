import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Router } from 'routes';

// components
import Layout from 'layout/layout/layout-app';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';
import Icon from 'components/ui/Icon';
import DashboardDetail from 'components/dashboards/detail';
import SimilarDatasets from 'components/datasets/similar-datasets/similar-datasets';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// utils
import { logEvent } from 'utils/analytics';

class DashboardsDetailPage extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    datasetIds: PropTypes.array.isRequired
  }

  state = { showShareModal: false }

  handleTagSelected(tag, labels = ['TOPIC']) {
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

  handleToggleShareModal = (showShareModal) => { this.setState({ showShareModal }); }

  render() {
    const {
      data: dashboard,
      datasetIds
    } = this.props;
    const { showShareModal } = this.state;
    const {
      name,
      summary,
      description,
      slug
    } = dashboard;

    // TEMPORARY FIX!!
    // TO-DO: Remove this once the Topics page has been fully refactored and has dissapeared
    // and has been replaced by the new public dashboards page
    const goToTopics = (typeof window !== 'undefined' &&
      window.location.href.indexOf('goTo=topics')) >= 0;

    return (
      <Layout
        title={name}
        description={summary}
        pageHeader
        className="page-dashboards c-page-dashboards"
      >
        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={[
                    {
                      name: 'Dashboards',
                      href: goToTopics ? '/topics' : '/myrw/dashboards'
                    }
                  ]}
                  />
                  <h1>{name}</h1>
                  {summary && (<h3>{summary}</h3>)}
                  <div className="page-header-info">
                    <ul>
                      <li>
                        <button
                          className="c-btn -tertiary -alt -clean"
                          onClick={() => this.handleToggleShareModal(true)}
                        >
                          <Icon
                            name="icon-share"
                            className="-small"
                          />
                          <span>Share</span>
                        </button>

                        <Modal
                          isOpen={showShareModal}
                          className="-medium"
                          onRequestClose={() => this.handleToggleShareModal(false)}
                        >
                          <ShareModal
                            links={{
                              link: typeof window !== 'undefined' && window.location.href,
                              embed: typeof window !== 'undefined' && `${window.location.origin}/embed/dashboard/${slug}`
                            }}
                            analytics={{
                              facebook: () => logEvent('Share', `Share dashboard: ${name}`, 'Facebook'),
                              twitter: () => logEvent('Share', `Share dashboard: ${name}`, 'Twitter'),
                              copy: type => logEvent('Share', `Share dashboard: ${name}`, `Copy ${type}`)
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
              {description && (
                <div className="column small-12">
                  <ReactMarkdown source={description} />
                </div>)}
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
                  Similar datasets
                </Title>

                <SimilarDatasets
                  datasetIds={datasetIds}
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

export default DashboardsDetailPage;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-app';
import Tabs from 'components/ui/Tabs';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';
import Icon from 'components/ui/icon';
import DashboardDetail from 'components/dashboards/detail';
import SimilarDatasets from 'components/datasets/similar-datasets/similar-datasets';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import EnergyCountryExplorer from './energy-country-explorer';

// utils
import { logEvent } from 'utils/analytics';

// services
import { fetchCountryPowerExplorerConfig } from 'services/config';

// constants
import { ENERGY_TABS } from './constants';

function DashboardsDetailPage(props) {
  const {
    data: dashboard,
    datasetIds,
    query: { tab }
  } = props;
  const {
    name,
    summary,
    description,
    slug
  } = dashboard;
  const [showShareModal, setShowShareModal] = useState(false);
  const [headerDescription, setHeaderDescription] = useState(summary);
  const isEnergyDashboard = slug === 'energy';
  const currentTab = tab || 'global';
  const headerClassName = classnames({
    'page-header-content': true,
    '-with-tabs': isEnergyDashboard
  });
  const headerText = (isEnergyDashboard && tab === 'country') ? 
    headerDescription : summary;

  // Temporary logic to show the country explorer only in preproduction and localhost
  const hostname = typeof window !== 'undefined' && window.location.hostname;
  const showCountryExplorer = hostname &&
    (hostname.startsWith('preproduction') || hostname.startsWith('localhost'));

  const handleTagSelected = (tag, labels = ['TOPIC']) => {
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
  };

  const handleToggleShareModal = showShareModal => setShowShareModal(showShareModal);

  useEffect(() => {
    fetchCountryPowerExplorerConfig()
        .then(config => setHeaderDescription(config.headerText))
        .catch(err => {
          toastr.error('Error loading country power explorer config'); 
          console.error(err);
        });
  }, []);

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
              <div className={headerClassName}>
                <Breadcrumbs items={[
                  {
                    name: 'Dashboards',
                    href: '/dashboards'
                  }
                ]}
                />
                <h1>{name}</h1>
                {headerText && (<h3>{headerText}</h3>)}
                <div className="page-header-info">
                  <ul>
                    <li>
                      <button
                        className="c-btn -tertiary -alt -clean"
                        onClick={() => handleToggleShareModal(true)}
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
                        onRequestClose={() => handleToggleShareModal(false)}
                      >
                        <ShareModal
                          links={{
                            link: typeof window !== 'undefined' && window.location.href,
                            embed: typeof window !== 'undefined' && `${window.location.origin}/embed/dashboard/${slug}`
                          }}
                          analytics={{
                            facebook: () => logEvent('Share', `Share dashboard: ${name}`, 'Facebook'),
                            twitter: () => logEvent('Share', `Share dashboard: ${name}`, 'Twitter'),
                            email: () => logEvent('Share', `Share dashboard: ${name}`, 'Email'),
                            copy: type => logEvent('Share', `Share dashboard: ${name}`, `Copy ${type}`)
                          }}
                        />
                      </Modal>
                    </li>
                  </ul>
                </div>
                {isEnergyDashboard && showCountryExplorer &&
                  <Tabs
                    options={ENERGY_TABS}
                    defaultSelected={currentTab}
                    selected={currentTab}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </header>


      {isEnergyDashboard && tab === 'country' &&
        <EnergyCountryExplorer />
      }
      {(!isEnergyDashboard || (isEnergyDashboard && tab !== 'country')) &&
        <div className="l-section">
          <div className="l-container">
            <div className="row">
              {description && (
                <div className="column small-12">
                  <ReactMarkdown linkTarget="_blank" source={description} />
                </div>)
              }
              <div className="column small-12">
                <DashboardDetail />
              </div>
            </div>
          </div>
        </div>
      }

      <div className="l-section">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <Title className="-extrabig -secondary -p-secondary">
                Similar datasets
                </Title>

              <SimilarDatasets
                datasetIds={datasetIds}
                onTagSelected={handleTagSelected}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

DashboardsDetailPage.propTypes = {
  data: PropTypes.object.isRequired,
  datasetIds: PropTypes.array.isRequired
};

export default DashboardsDetailPage;

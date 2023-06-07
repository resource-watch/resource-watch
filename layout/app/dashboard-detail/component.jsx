import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { toastr } from 'react-redux-toastr';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';

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
import EnergyCountryExplorer from 'layout/app/dashboard-detail/energy-country-explorer';
import LayoutCoralReefsDashboard from 'layout/layout/coral-reefs-dashboard/component';

// services
import { fetchCountryPowerExplorerConfig } from 'services/config';

// constants
import { ENERGY_TABS } from './constants';

const LayoutDashboardDetail = ({ dashboard }) => {
  const { name, summary, description, slug } = dashboard;
  const router = useRouter();
  const {
    query: { tab },
  } = router;
  const [showShareModal, setShowShareModal] = useState(false);
  const [headerDescription, setHeaderDescription] = useState(summary);
  const isEnergyDashboard = slug === 'energy';
  const isCoralReefsDashboard = slug === 'coral-reefs';
  const currentTab = tab || 'global';
  const headerClassName = classnames({
    'page-header-content': true,
    '-with-tabs': isEnergyDashboard,
  });
  const headerText = isEnergyDashboard && tab === 'country' ? headerDescription : summary;

  const handleTagSelected = useCallback(
    (tag, labels = ['TOPIC']) => {
      const tagSt = `["${tag.id}"]`;
      let treeSt = 'topics';
      if (labels.includes('TOPIC')) {
        treeSt = 'topics';
      } else if (labels.includes('GEOGRAPHY')) {
        treeSt = 'geographies';
      } else if (labels.includes('DATA_TYPE')) {
        treeSt = 'dataTypes';
      }

      router.push({
        pathname: 'explore',
        query: {
          [treeSt]: tagSt,
        },
      });
    },
    [router],
  );

  const handleToggleShareModal = useCallback(
    (_showShareModal) => {
      setShowShareModal(_showShareModal);
    },
    [setShowShareModal],
  );

  useEffect(() => {
    const loadCountryPowerExplorerConfig = async () => {
      try {
        const config = await fetchCountryPowerExplorerConfig();
        setHeaderDescription(config.headerText);
      } catch (e) {
        toastr.error('Error loading country power explorer config');
      }
    };

    if (
      process.env.NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD &&
      isEnergyDashboard &&
      tab === 'country'
    )
      loadCountryPowerExplorerConfig();
  }, [isEnergyDashboard, tab]);

  const datasets = useMemo(() => {
    const { content } = dashboard;
    let parsedContent = [];

    if (!content) return [];

    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      toastr.error('There was an error parsing the content of the dashboard');
    }

    const datasetIds = parsedContent.map((block) => {
      if (!block) return null;

      if (block.type === 'widget') {
        return block.content.datasetId;
      }

      if (block.type === 'grid') {
        return block.content.map((b) => {
          if (!b) return null;

          if (b.type === 'widget') return b.content.datasetId;

          return null;
        });
      }

      return null;
    });

    return compact(flatten(datasetIds));
  }, [dashboard]);

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
                <Breadcrumbs
                  items={[
                    {
                      name: 'Dashboards',
                      route: '/dashboards',
                    },
                  ]}
                />
                <h1>{name}</h1>
                {headerText && <h3>{headerText}</h3>}
                <div className="page-header-info">
                  <ul>
                    <li>
                      <button
                        type="button"
                        className="c-btn -tertiary -alt -clean"
                        onClick={() => handleToggleShareModal(true)}
                        data-cy="share-button"
                      >
                        <Icon name="icon-share" className="-small" />
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
                            embed:
                              typeof window !== 'undefined' &&
                              `${window.location.origin}/embed/dashboard/${slug}`,
                          }}
                        />
                      </Modal>
                    </li>
                  </ul>
                </div>
                {isEnergyDashboard && process.env.NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD && (
                  <Tabs options={ENERGY_TABS} defaultSelected={currentTab} selected={currentTab} />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {isEnergyDashboard &&
      tab === 'country' &&
      process.env.NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD ? (
        <EnergyCountryExplorer />
      ) : (
        <div className="l-section">
          <div className="l-container">
            <div className="row">
              {description && (
                <div className="column small-12">
                  <ReactMarkdown linkTarget="_blank" source={description} />
                </div>
              )}
              <div className="column small-12">
                {!isCoralReefsDashboard && <DashboardDetail dashboard={dashboard} />}
                {isCoralReefsDashboard && <LayoutCoralReefsDashboard />}
              </div>
            </div>
          </div>
        </div>
      )}
      {datasets.length > 0 && (
        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <Title className="-extrabig -secondary -p-secondary">Similar datasets</Title>
                <SimilarDatasets datasetIds={datasets} onTagSelected={handleTagSelected} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

LayoutDashboardDetail.propTypes = {
  dashboard: PropTypes.shape({
    name: PropTypes.string.isRequired,
    summary: PropTypes.string,
    description: PropTypes.string,
    slug: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default LayoutDashboardDetail;

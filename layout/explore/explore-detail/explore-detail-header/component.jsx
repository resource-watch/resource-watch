import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';
import { getTooltipContainer } from 'utils/tooltip';

// utils
import { logEvent } from 'utils/analytics';

export default function ExploreDetailHeader({
  dataset,
  setSelectedDataset,
  userIsLoggedIn,
  isSidebarOpen,
  setSidebarSection,
  setFiltersSearch,
  setFiltersSelected,
}) {
  const { query } = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const handleToggleFavorite = useCallback((isFavorite, resource) => {
    const datasetName = resource?.metadata[0]?.info?.name;
    if (isFavorite) {
      logEvent('Explore Menu', 'Add dataset to favorites', datasetName);
    } else {
      logEvent('Explore Menu', 'Remove dataset from favorites', datasetName);
    }
  }, []);

  const handleToggleCollection = useCallback((isAdded, resource) => {
    const datasetName = resource?.metadata[0]?.info?.name;
    if (isAdded) {
      logEvent('Explore Menu', 'Add dataset to a collection', datasetName);
    } else {
      logEvent('Explore Menu', 'Remove dataset from a collection', datasetName);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    const { search, section, topics } = query;
    setSelectedDataset(null);
    setSidebarSection(section);

    if (topics) setFiltersSelected({ key: 'topics', list: JSON.parse(decodeURIComponent(topics)) });

    if (search) {
      setFiltersSearch(search);
    }
  }, [query, setSelectedDataset, setSidebarSection, setFiltersSelected, setFiltersSearch]);

  const location = typeof window !== 'undefined' && window.location;
  const datasetName =
    dataset &&
    dataset.metadata &&
    dataset.metadata[0] &&
    dataset.metadata[0].info &&
    dataset.metadata[0].info.name;

  return (
    <div
      className="c-explore-detail-header"
      style={{
        ...(!isSidebarOpen && { position: 'absolute' }),
      }}
    >
      <button
        type="button"
        onClick={handleGoBack}
        className="c-btn -primary -compressed -fs-tiny all-datasets-button"
      >
        <Icon className="-small" name="icon-arrow-left-2" />
        <span>ALL DATASETS</span>
      </button>
      <div className="right-buttons">
        {/* Collections tooltip */}
        <LoginRequired
          clickCallback={() => {
            if (!userIsLoggedIn) {
              logEvent('Explore (Detail)', 'Anonymous user Clicks Save', datasetName);
            }
          }}
        >
          <Tooltip
            overlay={
              <CollectionsPanel
                resource={dataset}
                resourceType="dataset"
                onToggleFavorite={handleToggleFavorite}
                onToggleCollection={handleToggleCollection}
              />
            }
            overlayClassName="c-rc-tooltip"
            placement="bottomRight"
            trigger="click"
            getTooltipContainer={getTooltipContainer}
            monitorWindowResize
          >
            <button
              className="c-btn -quaternary -compressed -fs-tiny"
              onClick={() => {
                if (userIsLoggedIn) {
                  logEvent('Explore (Detail)', 'Authenticated user Clicks Save', datasetName);
                }
              }}
            >
              <Icon className="-small" name="icon-star-full" />
              <span>SAVE</span>
            </button>
          </Tooltip>
        </LoginRequired>

        <button
          className="c-btn -quaternary -compressed -fs-tiny share-button"
          onClick={() => setShowShareModal(true)}
        >
          <Icon className="-small" name="icon-arrow-up-2" />
          <span>SHARE</span>
          <Modal
            isOpen={showShareModal}
            className="-medium"
            onRequestClose={() => setShowShareModal(false)}
          >
            <ShareModal
              links={{
                link: location && location.href,
                embed: location && `${location.origin}/embed${location.pathname}${location.search}`,
              }}
              analytics={{
                facebook: () => logEvent('Share', 'Share explore', 'Facebook'),
                twitter: () => logEvent('Share', 'Share explore', 'Twitter'),
                email: () => logEvent('Share', 'Share explore', 'Email'),
                copy: (type) => logEvent('Share', 'Share explore', `Copy ${type}`),
              }}
            />
          </Modal>
        </button>
      </div>
    </div>
  );
}

ExploreDetailHeader.propTypes = {
  dataset: PropTypes.shape({
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  userIsLoggedIn: PropTypes.bool.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  setSelectedDataset: PropTypes.func.isRequired,
};

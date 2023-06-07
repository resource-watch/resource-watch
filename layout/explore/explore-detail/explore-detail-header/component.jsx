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
        <LoginRequired>
          <Tooltip
            overlay={<CollectionsPanel resource={dataset} resourceType="dataset" />}
            overlayClassName="c-rc-tooltip"
            placement="bottomRight"
            trigger="click"
            getTooltipContainer={getTooltipContainer}
            monitorWindowResize
          >
            <button className="c-btn -quaternary -compressed -fs-tiny" type="button">
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

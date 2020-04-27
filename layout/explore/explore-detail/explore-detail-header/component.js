import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// Tooltip
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';
import { getTooltipContainer } from 'utils/tooltip';

// utils
import { logEvent } from 'utils/analytics';

// Styles
import './styles.scss';

function ExploreDetailHeaderComponent(props) {
  const { dataset, setSelectedDataset, userIsLoggedIn } = props;
  const [showShareModal, setShowShareModal] = useState(false);
  const location = typeof window !== 'undefined' && window.location;
  const datasetName = dataset && dataset.metadata && dataset.metadata[0] &&
      dataset.metadata[0].info && dataset.metadata[0].info.name;
  
  return (
    <div className="c-explore-detail-header">
      <button
        className="c-btn -primary -compressed -fs-tiny all-datasets-button"
        onClick={() => setSelectedDataset(null)}
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
                context="Explore (Detail)"
              />
            }
            overlayClassName="c-rc-tooltip"
            placement="bottomRight"
            trigger="click"
            getTooltipContainer={getTooltipContainer}
            monitorWindowResize
          >
            <button
              className="c-btn -secondary -compressed -fs-tiny" 
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
          className="c-btn -secondary -compressed -fs-tiny share-button"
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
                  embed: location && `${location.origin}/embed${location.pathname}${location.search}`
                }}
              analytics={{
                  facebook: () => logEvent('Share', 'Share explore', 'Facebook'),
                  twitter: () => logEvent('Share', 'Share explore', 'Twitter'),
                  email: () => logEvent('Share', 'Share explore', 'Email'),
                  copy: type => logEvent('Share', 'Share explore', `Copy ${type}`)
                }}
            />
          </Modal>
        </button>
      </div>
    </div>
  );
}

ExploreDetailHeaderComponent.propTypes = {
  dataset: PropTypes.object.isRequired,
  userIsLoggedIn: PropTypes.bool.isRequired,
  // Store
  setSelectedDataset: PropTypes.func.isRequired
};

export default ExploreDetailHeaderComponent;

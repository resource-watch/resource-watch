import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

// components
import LoginRequired from 'components/ui/login-required';
import Modal from 'components/modal/modal-component';
import DatasetSubscriptionsModal from 'components/modal/subscriptions-modal/dataset';
import ProminentButton from 'components/prominent-button';
import Icon from 'components/ui/icon';

// utils
import { getLabel } from 'utils/datasets/dataset-helpers';
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

const ExploreDetailButtons = ({
  dataset,
}) => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const { metadata, subscribable } = dataset;
  const { info } = metadata[0];
  const isSubscribable = subscribable && Object.keys(subscribable).length > 0;

  const handleDownloadSource = useCallback(() => { logEvent('Explore', 'Download data from source', getLabel(dataset)); }, [dataset]);
  const handleDownload = useCallback(() => { logEvent('Explore', 'Download data', getLabel(dataset)); }, [dataset]);
  const handleLearnMore = useCallback(() => { logEvent('Explore', 'Click to data provider', getLabel(dataset)); }, [dataset]);
  const openSubscribeModal = useCallback(() => { setShowSubscribeModal(true); }, []);
  const closeSubscribeModal = useCallback(() => { setShowSubscribeModal(false); }, []);

  return (
    <div className="c-explore-detail-buttons">
      <div className="dataset-actions">
        {info.data_download_original_link && (
          <ProminentButton
            isLink
            onClick={handleDownloadSource}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={info.data_download_original_link}
            >
              <Icon name="icon-download" />
              <span>
                download from source
              </span>
            </a>

          </ProminentButton>
        )}
        {info.data_download_link && (
          <ProminentButton
            isLink
            onClick={handleDownload}
          >
            <a href={info.data_download_link}>
              <Icon name="icon-download" />
              <span>
                download
              </span>
            </a>
          </ProminentButton>
        )}
        {info.learn_more_link && (
          <ProminentButton
            isLink
            onClick={handleLearnMore}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={info.learn_more_link}
            >
              <Icon name="icon-learn-more" />
              <span>
                learn more from source
              </span>
            </a>
          </ProminentButton>
        )}
        {isSubscribable && (
          <LoginRequired redirect={false}>
            <ProminentButton
              onClick={openSubscribeModal}
            >
              <Icon name="icon-subscription" />
              <span>
                subscribe to alerts
              </span>
            </ProminentButton>
          </LoginRequired>
        )}
      </div>
      <Modal
        isOpen={showSubscribeModal}
        onRequestClose={closeSubscribeModal}
      >
        <DatasetSubscriptionsModal
          onRequestClose={closeSubscribeModal}
          dataset={{ ...dataset, metadata: metadata[0] }}
        />
      </Modal>
    </div>
  );
};

ExploreDetailButtons.propTypes = {
  dataset: PropTypes.shape({
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          data_download_original_link: PropTypes.string,
          learn_more_link: PropTypes.string,
          data_download_link: PropTypes.string,
        }),
      }),
    ).isRequired,
    subscribable: PropTypes.shape({}),
  }).isRequired,
};

export default ExploreDetailButtons;

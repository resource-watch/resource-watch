import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import LoginRequired from 'components/ui/login-required';
import Modal from 'components/modal/modal-component';
import DatasetSubscriptionsModal from 'components/modal/subscriptions-modal/dataset';
import Icon from 'components/ui/icon';

// Utils
import { getLabel } from 'utils/datasets/dataset-helpers';
import { logEvent } from 'utils/analytics';

// Styles
import './styles.scss';

function ExploreDetailButtons(props) {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const { dataset: { metadata, subscribable } } = props;
  const { info } = metadata[0];
  const isSubscribable = subscribable && Object.keys(subscribable).length > 0;
  const numberOfButtons = (info.data_download_original_link ? 1 : 0) +
    (info.learn_more_link ? 1 : 0) + (isSubscribable ? 1 : 0) +
    (info.data_download_link ? 1 : 0);

  const buttonsClassName = classnames({
    column: true,
    'small-4': numberOfButtons % 3 === 0,
    'small-6': numberOfButtons % 2 === 0
  });

  return (
    <div className="c-explore-detail-buttons">
      <div className="row">
        {info.data_download_original_link && (
          <div className={buttonsClassName}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={info.data_download_original_link}
              onClick={() => {
                logEvent('Explore', 'Download data from source', getLabel(props.dataset));
              }}
            >
              <div className="explore-detail-button">
                <Icon name="icon-download" />
                <div className="button-text">
                  DOWNLOAD FROM SOURCE
                </div>
              </div>
            </a>
          </div>
        )}
        {info.data_download_link && (
          <div className={buttonsClassName}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={info.data_download_link}
              onClick={() => {
                logEvent('Explore', 'Download data', getLabel(props.dataset));
              }}
            >
              <div className="explore-detail-button">
                <Icon name="icon-download" />
                <div className="button-text">
                  DOWNLOAD
                </div>
              </div>
            </a>
          </div>
        )}
        {info.learn_more_link && (
          <div className={buttonsClassName}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={info.learn_more_link}
              onClick={() => {
                logEvent('Explore', 'Click to data provider', getLabel(props.dataset));
              }}
            >
              <div className="explore-detail-button">
                <Icon name="icon-learn-more" />
                <div className="button-text">
                  LEARN MORE FROM SOURCE
                </div>
              </div>
            </a>
          </div>
        )}
        {isSubscribable && (
          <div className={buttonsClassName}>
            <LoginRequired>
              <a
                role="button"
                tabIndex={0}
                onKeyPress={() => setShowSubscribeModal(true)}
                onClick={() => setShowSubscribeModal(true)}
              >
                <div className="explore-detail-button">
                  <Icon name="icon-subscription" />
                  <div className="button-text">
                    SUBSCRIBE TO ALERTS
                  </div>
                </div>
              </a>
            </LoginRequired>
          </div>
        )}
      </div>
      <Modal
        isOpen={showSubscribeModal}
        onRequestClose={() => setShowSubscribeModal(false)}
      >
        <DatasetSubscriptionsModal
          onRequestClose={() => setShowSubscribeModal(false)}
          dataset={{ ...props.dataset, metadata: metadata[0] }}
        />
      </Modal>
    </div>
  );
}

ExploreDetailButtons.propTypes = { dataset: PropTypes.object.isRequired };

export default ExploreDetailButtons;

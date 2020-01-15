import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import MediaQuery from 'react-responsive';

// components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';
import Modal from 'components/modal/modal-component';
import DatasetSubscriptionsModal from 'components/modal/subscriptions-modal/dataset';

// utils
import isEmpty from 'lodash/isEmpty';
import { breakpoints } from 'utils/responsive';
import { getLabel } from 'utils/datasets/dataset-helpers';
import { logEvent } from 'utils/analytics';

class ExploreDetailButtons extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object.isRequired,
    partner: PropTypes.object,
    responsive: PropTypes.object.isRequired
  }

  static defaultProps = { partner: {} }

  state = { showSubscribeModal: false }

  /**
   * HELPERS
   * - getDatasetMetadata
   * - getDatasetName
   * - isSubscribable
  */
  getDatasetMetadata() {
    const { dataset } = this.props;
    return (dataset.metadata && dataset.metadata[0]) || {};
  }

  getDatasetName() {
    const { dataset } = this.props;
    const metadata = this.getDatasetMetadata();
    return metadata.info && metadata.info.name ? metadata.info.name : dataset.name;
  }

  isSubscribable() {
    const { dataset } = this.props;
    return dataset && !isEmpty(dataset.subscribable);
  }

  handleToggleSubscribeModal = (bool) => {
    this.setState({ showSubscribeModal: bool });
  }

  handleDownload = () => {
    const { dataset } = this.props;

    logEvent('Explore', 'Download data', getLabel(dataset));
  }

  handleDownloadSource = () => {
    const { dataset } = this.props;

    logEvent('Explore', 'Download data from source', getLabel(dataset));
  }

  handleLearnMore = () => {
    const { dataset } = this.props;

    logEvent('Explore', 'Click to data provider', dataset.provider);
  }

  render() {
    const { dataset, partner, responsive: { fakeWidth } } = this.props;
    const { showSubscribeModal } = this.state;
    const metadata = this.getDatasetMetadata();

    return (
      <div className="c-explore-detail-actions">
        {partner && partner.logo &&
          <div className="partner-container">
            <div className="partner-text-container">
              Partner:
            </div>
            <div className="partner-logo-container">
              <a href={partner.website} target="_blank" rel="noopener noreferrer">
                <img src={partner.logo && partner.logo.medium} alt={partner.name} />
              </a>
            </div>
          </div>
        }
        {!!dataset.layer.length &&
          <MediaQuery
            minDeviceWidth={breakpoints.medium - 1}
            values={{ deviceWidth: fakeWidth }}
          >
            <div>
              <Link
                route="explore"
                params={{
                  layers: encodeURIComponent(JSON.stringify([{
                    dataset: dataset.id,
                    opacity: 1,
                    visible: true,
                    layer: dataset.layer[0].id
                  }]))
                }}
              >
                <a className="c-button -primary">
                  Open in map
                </a>
              </Link>
            </div>
          </MediaQuery>
        }

        {metadata && metadata.info && metadata.info.data_download_link &&
          <div>
            <a
              className="c-button -secondary"
              target="_blank"
              rel="noopener noreferrer"
              href={metadata.info && metadata.info.data_download_link}
              onClick={this.handleDownload}
            >
              Download
            </a>
          </div>
        }

        {this.isSubscribable() &&
          <div>
            <LoginRequired>
              <button
                className="c-button -secondary"
                onClick={() => this.handleToggleSubscribeModal(true)}
              >
                Subscribe to alerts
              </button>
            </LoginRequired>
          </div>
        }

        {metadata.info && metadata.info.data_download_original_link &&
          <div>
            <a
              className="c-button -secondary"
              target="_blank"
              rel="noopener noreferrer"
              onClick={this.handleDownloadSource}
              href={metadata.info && metadata.info.data_download_original_link}
            >
              <span>
                Download from source
              </span>

              <Icon name="icon-external" className="-smaller" />
            </a>
          </div>
        }

        {metadata.info && metadata.info.learn_more_link &&
          <div>
            <a
              className="c-button -secondary"
              target="_blank"
              rel="noopener noreferrer"
              href={metadata.info && metadata.info.learn_more_link}
              onClick={this.handleLearnMore}
            >
              <span>
                Learn more
              </span>
              <Icon name="icon-external" className="-smaller" />
            </a>
          </div>
        }

        <Modal
          isOpen={showSubscribeModal}
          onRequestClose={() => this.handleToggleSubscribeModal(false)}
        >
          <DatasetSubscriptionsModal
            onRequestClose={() => this.handleToggleSubscribeModal(false)}
          />
        </Modal>
      </div>
    );
  }
}

export default ExploreDetailButtons;

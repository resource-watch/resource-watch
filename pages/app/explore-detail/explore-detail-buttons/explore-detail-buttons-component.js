import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import isEmpty from 'lodash/isEmpty';
import { logEvent } from 'utils/analytics';

// Next
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';
import LoginRequired from 'components/ui/LoginRequired';

// Modal
import Modal from 'components/modal/modal-component';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';

class ExploreDetailButtons extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object,
    partner: PropTypes.object,
    user: PropTypes.object
  }

  state = {
    showSubscribeModal: false
  }

  /**
   * HELPERS
   * - getDatasetMetadata
   * - getDatasetName
   * - isSubscribable
  */
  getDatasetMetadata() {
    const { dataset } = this.props;
    return dataset.metadata || {};
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

  /**
   * UI EVENTS
   * - handleToggleSubscribeModal
  */
  handleToggleSubscribeModal = (bool) => {
    this.setState({ showSubscribeModal: bool });
  }

  render() {
    const { dataset, partner, user } = this.props;
    const metadata = this.getDatasetMetadata();

    return (
      <div className="c-explore-detail-actions">
        {!!dataset.layer.length &&
          <Link
            route="explore"
            params={{
              layers: encodeURIComponent(JSON.stringify([{
                dataset: dataset.id,
                visible: true,
                layers: dataset.layer.map(((l, i) => ({
                  id: l.id, active: i === 0
                })))
              }]))
            }}
          >
            <a href="/data/explore" className="c-button -primary -fullwidth">
              Open in Explore
            </a>
          </Link>
        }

        {metadata && metadata.info && metadata.info.data_download_link &&
          <a
            className="c-button -secondary -fullwidth"
            target="_blank"
            href={metadata.info && metadata.info.data_download_link}
            onClick={() => logEvent('Explore', 'Download data', dataset && dataset.attributes.name)}
          >
            Download
          </a>
        }

        {this.isSubscribable() &&
          <LoginRequired text="Log in to subscribe to dataset changes">
            <button
              className="c-button -secondary -fullwidth"
              onClick={() => this.handleToggleSubscribeModal(true)}
            >
            Subscribe to alerts
              <Modal
                isOpen={this.state.showSubscribeModal}
                onRequestClose={() => this.handleToggleSubscribeModal(false)}
              >
                <SubscribeToDatasetModal
                  dataset={dataset}
                  showDatasetSelector={false}
                  onRequestClose={() => this.handleToggleSubscribeModal(false)}
                />
              </Modal>
            </button>
          </LoginRequired>
        }

        {metadata.info && metadata.info.data_download_original_link &&
          <a
            className="c-button -secondary -fullwidth"
            target="_blank"
            href={metadata.info && metadata.info.data_download_original_link}
          >
            <span>
              Download from source
            </span>

            <Icon name="icon-external" className="-smaller" />
          </a>
        }

        {metadata.info && metadata.info.learn_more_link &&
          <a
            className="c-button -secondary -fullwidth"
            target="_blank"
            href={metadata.info && metadata.info.learn_more_link}
          >
            <span>
              Learn more
            </span>
            <Icon name="icon-external" className="-smaller" />
          </a>
        }

        {partner.logo &&
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

      </div>
    );
  }
}

export default ExploreDetailButtons;

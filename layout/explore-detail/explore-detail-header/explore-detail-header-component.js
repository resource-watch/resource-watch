import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Utils
import { logEvent } from 'utils/analytics';
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Components
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Icon from 'components/ui/Icon';
import LoginRequired from 'components/ui/login-required';

// Tooltip
import { Tooltip } from 'wri-api-components';
import CollectionsPanel from 'components/collections-panel';

// Modal
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

class ExploreDetailHeader extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object,
    user: PropTypes.object.isRequired
  }

  static defaultProps = { dataset: {} }

  state = { showShareModal: false }

  getDatasetMetadata() {
    const { dataset } = this.props;
    return dataset.metadata || {};
  }

  getDatasetName() {
    const { dataset } = this.props;
    const metadata = this.getDatasetMetadata();
    return metadata.info && metadata.info.name ? metadata.info.name : dataset.name;
  }

  handleToggleShareModal = (bool) => {
    this.setState({ showShareModal: bool });
  }

  render() {
    const { dataset, user } = this.props;
    const metadata = this.getDatasetMetadata();
    const datasetName = this.getDatasetName();
    const isInACollection = belongsToACollection(user, { id: dataset.id });

    // Favorites
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });

    const starIconClass = classnames({
      '-small': true,
      '-filled': isInACollection,
      '-empty': !isInACollection
    });

    return (
      <div className="page-header-content">
        <Breadcrumbs
          items={[{ name: 'Explore datasets', route: 'explore' }]}
        />

        <h1>{datasetName}</h1>

        {metadata.info && metadata.info.functions &&
          <h3>{metadata.info.functions}</h3>
        }

        <div className="page-header-info">
          <ul>
            <li>Source: {(metadata.source) || '-'}</li>
            {/* Temporarilly hidden until data is fixed
            <li>Last update: {dataset.dateLastUpdated || '-'}</li>
            } */}
            <li>
              <button className="c-btn -tertiary -alt -clean" onClick={() => this.handleToggleShareModal(true)}>
                <Icon name="icon-share" className="-small" />
                <span>Share</span>

                <Modal
                  isOpen={this.state.showShareModal}
                  className="-medium"
                  onRequestClose={() => this.handleToggleShareModal(false)}
                >
                  <ShareModal
                    links={{ link: typeof window !== 'undefined' && window.location.href }}
                    analytics={{
                      facebook: () => logEvent('Share', `Share dataset: ${datasetName}`, 'Facebook'),
                      twitter: () => logEvent('Share', `Share dataset: ${datasetName}`, 'Twitter'),
                      copy: type => logEvent('Share', `Share dataset: ${datasetName}`, `Copy ${type}`)
                    }}
                  />
                </Modal>
              </button>
            </li>

            {/* Favorite dataset icon */}
            <li>
              <LoginRequired text="Log in or sign up to save items in favorites">
                <Tooltip
                  overlay={
                    <CollectionsPanel
                      resource={{ id: dataset.id }}
                      resourceType="dataset"
                    />
                  }
                  overlayClassName="c-rc-tooltip"
                  overlayStyle={{ color: '#c32d7b' }}
                  placement="bottomLeft"
                  trigger="click"
                >
                  <button
                    className="c-btn -tertiary -alt -clean"
                    tabIndex={-1}
                  >
                    <Icon
                      name={starIconName}
                      className={starIconClass}
                    />
                    <span>Save</span>
                  </button>
                </Tooltip>
              </LoginRequired>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ExploreDetailHeader;

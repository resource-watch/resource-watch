import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import ToggleFavorite from 'components/favorites/ToggleFavorite';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Icon from 'components/ui/Icon';

// Modal
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// Constants
class ExploreDetailHeader extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object
  }

  state = {
    showShareModal: false
  }

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
    const { dataset } = this.props;
    const metadata = this.getDatasetMetadata();
    const datasetName = this.getDatasetName();

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
            <li>Last update: {dataset && new Date(dataset.updatedAt).toJSON().slice(0, 10).replace(/-/g, '/')}</li>
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
                    links={{
                      link: typeof window !== 'undefined' && window.location.href
                    }}
                    analytics={{
                      facebook: () => logEvent('Share', `Share dataset: ${datasetName}`, 'Facebook'),
                      twitter: () => logEvent('Share', `Share dataset: ${datasetName}`, 'Twitter'),
                      copy: type => logEvent('Share', `Share dataset: ${datasetName}`, `Copy ${type}`)
                    }}
                  />
                </Modal>
              </button>
            </li>

            <li><ToggleFavorite data={dataset} type="dataset" /></li>

          </ul>
        </div>
      </div>
    );
  }
}

export default ExploreDetailHeader;

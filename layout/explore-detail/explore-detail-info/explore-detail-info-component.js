import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

// Utils
import { getDatasetMetadata } from 'layout/explore-detail/explore-detail-helpers';
import { logEvent } from 'utils/analytics';

// Modal
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// Constants
class ExploreDetailInfo extends PureComponent {
  static propTypes = { dataset: PropTypes.object }

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
    const { dataset } = this.props;
    const metadata = getDatasetMetadata(dataset);
    const datasetName = this.getDatasetName();

    return (
      <div className="c-explore-detail-info">
        <div className="first-row-container">
          {metadata.info && metadata.info.technical_title ? (
            <div className="l-section-mod medium-7">
              <h3>Formal name</h3>
              <p>{metadata.info.technical_title}</p>
            </div>
          ) : null}
          <button
            className="c-button -secondary"
            onClick={() => this.handleToggleShareModal(true)}
          >
            Share dataset
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
        </div>

        {metadata.info && metadata.info.cautions &&
          <div className="l-section-mod medium-7">
            <h3>Cautions</h3>
            <ReactMarkdown source={metadata.info.cautions} />
          </div>}

        {metadata.info && metadata.info.citation &&
          <div className="l-section-mod medium-7">
            <h3>Suggested citation</h3>
            <ReactMarkdown source={metadata.info.citation} />
          </div>}

        {dataset && dataset.attributes && dataset.attributes.type &&
          <div className="l-section-mod">
            <h3>Data type</h3>
            <p>{dataset.attributes.type}</p>
          </div>}

        {metadata.info && metadata.info.sources ? (
          <div className="l-section-mod">
            <h3>Sources</h3>
            {metadata.info.sources.map(source => (
              <div
                key={source['source-name']}
              >
                {source['source-name']}
                {source['source-description']}
              </div>
            ))}
          </div>
        ) : null}

        <div className="l-section-mod row">
          {metadata.info && metadata.info.geographic_coverage ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Geographic coverage</h3>
              <p>{metadata.info.geographic_coverage}</p>
            </div>
          ) : null}

          {metadata.info && metadata.info.spatial_resolution ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Spatial resolution</h3>
              <p>{metadata.info.spatial_resolution}</p>
            </div>
          ) : null}

          {metadata.info && metadata.info.date_of_content ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Date of content</h3>
              <p>{metadata.info.date_of_content}</p>
            </div>
          ) : null}

          {metadata.info && metadata.info.frequency_of_updates ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Frequency of updates</h3>
              <p>{metadata.info.frequency_of_updates}</p>
            </div>
          ) : null}
        </div>

        <div className="l-section-mod row">
          {metadata.info && metadata.info.license ? (
            <div className="column small-6 medium-4 large-3">
              <h3>License</h3>
              <p>
                {!!metadata.info.license_link &&
                  <a href={metadata.info.license_link} target="_blank" rel="noopener noreferrer">{metadata.info.license}</a>
                }
                {!metadata.info.license_link &&
                  metadata.info.license
                }
              </p>
            </div>
          ) : null}

          {metadata.info && metadata.info.summary_of_license ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Summary of license</h3>
              <p>{metadata.info.summary_of_license}</p>
            </div>
          ) : null}

          {metadata.info && metadata.info.link_to_license ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Link to full license</h3>
              <a href={metadata.info.link_to_license} target="_blank" rel="noopener noreferrer">
                {metadata.info.link_to_license}
              </a>
            </div>
          ) : null}

          {metadata && metadata.language ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Published language</h3>
              <p>{metadata.language}</p>
            </div>
          ) : null}
        </div>

        {metadata.info && metadata.info.language && metadata.info.language.toLowerCase() !== 'en' ? (
          <div className="l-section-mod">
            <h3>Translated title</h3>
            <p>{metadata.info && metadata.info.translated_title}</p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ExploreDetailInfo;

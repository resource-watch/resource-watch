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
                  email: () => logEvent('Share', `Share dataset: ${datasetName}`, 'Email'),
                  copy: type => logEvent('Share', `Share dataset: ${datasetName}`, `Copy ${type}`)
                }}
              />
            </Modal>
          </button>
        </div>

        {metadata.info && metadata.info.cautions &&
          <div className="l-section-mod medium-7">
            <h3>Cautions</h3>
            <ReactMarkdown linkTarget="_blank" source={metadata.info.cautions} />
          </div>}

        {metadata.info && metadata.info.citation &&
          <div className="l-section-mod medium-7">
            <h3>Suggested citation</h3>
            <ReactMarkdown linkTarget="_blank" source={metadata.info.citation} />
          </div>}

        {dataset && dataset.attributes && dataset.attributes.type &&
          <div className="l-section-mod">
            <h3>Data type</h3>
            <ReactMarkdown linkTarget="_blank" source={dataset.attributes.type} />
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
              <ReactMarkdown linkTarget="_blank" source={metadata.info.geographic_coverage} />
            </div>
          ) : null}

          {metadata.info && metadata.info.spatial_resolution ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Spatial resolution</h3>
              <ReactMarkdown linkTarget="_blank" source={metadata.info.spatial_resolution} />
            </div>
          ) : null}

          {metadata.info && metadata.info.date_of_content ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Date of content</h3>
              <ReactMarkdown linkTarget="_blank" source={metadata.info.date_of_content} />
            </div>
          ) : null}

          {metadata.info && metadata.info.frequency_of_updates ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Frequency of updates</h3>
              <ReactMarkdown linkTarget="_blank" source={metadata.info.frequency_of_updates} />
            </div>
          ) : null}
        </div>

        <div className="l-section-mod row">
          {metadata.info && metadata.info.license ? (
            <div className="column small-6 medium-4 large-3">
              <h3>License</h3>
              {!!metadata.info.license_link &&
                <p>
                  <a href={metadata.info.license_link} target="_blank" rel="noopener noreferrer">{metadata.info.license}</a>
                </p>
              }
              {!metadata.info.license_link &&
                <ReactMarkdown linkTarget="_blank" source={metadata.info.license} />
              }
            </div>
          ) : null}

          {metadata.info && metadata.info.summary_of_license ? (
            <div className="column small-6 medium-4 large-3">
              <h3>Summary of license</h3>
              <ReactMarkdown linkTarget="_blank" source={metadata.info.summary_of_license} />
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
              <ReactMarkdown linkTarget="_blank" source={metadata.language} />
            </div>
          ) : null}
        </div>

        {metadata.info && metadata.info.language && metadata.info.language.toLowerCase() !== 'en' ? (
          <div className="l-section-mod">
            <h3>Translated title</h3>
            <ReactMarkdown linkTarget="_blank" source={metadata.info && metadata.info.translated_title} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default ExploreDetailInfo;

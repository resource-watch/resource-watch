import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import truncate from 'lodash/truncate';
import classnames from 'classnames';

// Constants
class ExploreDetailInfo extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object
  }

  state = {
    showDescription: false,
    showFunction: false,
    showCautions: false
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

  /**
   * Shorten the given text and format it so the full length
   * can be toggled via a button modifying the state
   * @param {string} [text=''] Text to shorten
   * @param {string} fieldToManage Property of the state to toggle
   * @param {number} [limitChar=1120] Limit of characters
   * @returns
   */
  shortenAndFormat(text = '', fieldToManage, limitChar = 1120) {
    if (text.length <= limitChar) {
      return text;
    }

    const visible = this.state[fieldToManage] || false;
    const shortenedText = truncate(text, { length: limitChar, separator: '', omission: '...' });

    return (
      <div className="shortened-text">
        {!visible ? `${shortenedText}...` : text}
        <button
          className={classnames('read-more', { '-less': visible })}
          onClick={() => this.setState({ [fieldToManage]: !visible })}
        >
          {visible ? 'Read less' : 'Read more'}
        </button>
      </div>
    );
  }

  render() {
    const { dataset } = this.props;
    const metadata = this.getDatasetMetadata();

    // const formattedDescription = this.shortenAndFormat(description, 'showDescription');
    // const formattedFunctions = this.shortenAndFormat(functions || '', 'showFunction');
    // const formattedCautions = this.shortenAndFormat(cautions || '', 'showCautions');


    return (
      <div className="c-explore-detail-info">
        {metadata.info && metadata.info.technical_title ? (
          <div className="l-section-mod">
            <h3>Formal name</h3>
            <p>{metadata.info.technical_title}</p>
          </div>
        ) : null}

        {metadata.description ? (
          <div className="dataset-info-description">
            <h3>Description</h3>
            {this.shortenAndFormat(metadata.description, 'showDescription')}
          </div>
        ) : null}

        {metadata.info && metadata.info.geographic_coverage ? (
          <div className="l-section-mod">
            <h3>Geographic coverage</h3>
            <p>{metadata.info.geographic_coverage}</p>
          </div>
        ) : null}

        {dataset && dataset.attributes && dataset.attributes.type ? (
          <div className="l-section-mod">
            <h3>Data type</h3>
            <p>{dataset.attributes.type}</p>
          </div>
        ) : null}

        {metadata.info && metadata.info.spatial_resolution ? (
          <div className="l-section-mod">
            <h3>Spatial resolution</h3>
            <p>{metadata.info.spatial_resolution}</p>
          </div>
        ) : null}

        {metadata.info && metadata.info.date_of_content ? (
          <div className="l-section-mod">
            <h3>Date of content</h3>
            <p>{metadata.info.date_of_content}</p>
          </div>
        ) : null}

        {metadata.info && metadata.info.frequency_of_updates ? (
          <div className="l-section-mod">
            <h3>Frequency of updates</h3>
            <p>{metadata.info.frequency_of_updates}</p>
          </div>
        ) : null}

        {metadata.info && metadata.info.cautions ? (
          <div className="l-section-mod">
            <h3>Cautions</h3>
            <p>{this.shortenAndFormat(metadata.info.cautions, 'showCautions')}</p>
          </div>
        ) : null}

        {metadata.info && metadata.info.license ? (
          <div className="l-section-mod">
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
          <div className="l-section-mod">
            <h3>Summary of license</h3>
            <p>{metadata.info.summary_of_license}</p>
          </div>
        ) : null}

        {metadata.info && metadata.info.link_to_license ? (
          <div className="l-section-mod">
            <h3>Link to full license</h3>
            <a href={metadata.info.link_to_license} target="_blank">
              {metadata.info.link_to_license}
            </a>
          </div>
        ) : null}

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

        {metadata.info && metadata.info.citation ? (
          <div className="l-section-mod">
            <h3>Citation</h3>
            <p>{metadata.info && metadata.info.citation}</p>
          </div>
        ) : null}

        {metadata && metadata.language ? (
          <div className="l-section-mod">
            <h3>Published language</h3>
            <p>{metadata.language}</p>
          </div>
        ) : null}

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

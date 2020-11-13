import React from 'react';
import PropTypes from 'prop-types';
import ReadMore from 'components/ui/read-more';
import ReactMarkdown from 'react-markdown';

// constants
import { DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS } from 'layout/explore/explore-detail/constants';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

const FurtherInformationComponent = ({
  metadata: {
    info: {
      technical_title: technicalTitle,
      cautions,
      citation,
      sources,
      geographic_coverage: geographicCoverage,
      frequency_of_updates: frequencyOfUpdates,
      license,
      license_link: licenseLink,
      date_of_content: dateOfContent,
      spatial_resolution: spatialResolution,
    },
    language,
  },
}) => (
  <div className="c-further-information">
    <h3>Further information</h3>
    {technicalTitle && (
      <div className="metadata-field">
        <h4>Formal name</h4>
        <p>{technicalTitle}</p>
      </div>
    )}
    {cautions && (
      <div className="metadata-field">
        <h4>Cautions</h4>
        <ReadMore
          markdown
          text={cautions}
          limitChar={DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS}
          readMoreClicked={() => logEvent('Explore (Detail)', 'Clicks Read More', 'cautions')}
        />
      </div>
    )}
    {citation && (
      <div className="metadata-field">
        <h4>Suggested citation</h4>
        <ReadMore
          markdown
          text={citation}
          limitChar={DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS}
          readMoreClicked={() => logEvent('Explore (Detail)', 'Clicks Read More', 'citation')}
        />
      </div>
    )}
    {spatialResolution && (
      <div className="metadata-field">
        <h4>Spatial resolution</h4>
        <ReadMore
          markdown
          text={spatialResolution}
          limitChar={DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS}
          readMoreClicked={() => logEvent('Explore (Detail)', 'Clicks Read More', 'spatial resolution')}
        />
      </div>
    )}
    {sources && (
      <div className="metadata-field">
        <h4>Sources</h4>
        {
          sources.map((source) => (
            <div key={source.id}>
              {source['source-name']}
              {source['source-description']}
            </div>
          ))
        }
      </div>
    )}
    <div className="row">
      <div className="column small-6">
        <div className="metadata-field">
          <h4>Geographic coverage</h4>
          <ReactMarkdown linkTarget="_blank" source={geographicCoverage} />
        </div>
      </div>
      <div className="column small-6">
        <div className="metadata-field">
          <h4>Frequency of updates</h4>
          <ReactMarkdown linkTarget="_blank" source={frequencyOfUpdates} />
        </div>
      </div>
      <div className="column small-6">
        <div className="metadata-field">
          <h4>Published language</h4>
          <ReactMarkdown linkTarget="_blank" source={language} />
        </div>
      </div>
      <div className="column small-6">
        <div className="metadata-field">
          <h4>License</h4>
          <a
            href={licenseLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            {license}
          </a>
        </div>
      </div>
      <div className="column small-6">
        <div className="metadata-field">
          <h4>Date of content</h4>
          <ReactMarkdown linkTarget="_blank" source={dateOfContent} />
        </div>
      </div>
    </div>
  </div>
);

FurtherInformationComponent.propTypes = {
  metadata: PropTypes.shape({
    info: PropTypes.shape({
      technical_title: PropTypes.string,
      cautions: PropTypes.string,
      citation: PropTypes.string,
      sources: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          'source-name': PropTypes.string,
          'source-description': PropTypes.string,
        }),
      ),
      geographic_coverage: PropTypes.string,
      frequency_of_updates: PropTypes.string,
      license: PropTypes.string,
      license_link: PropTypes.string,
      date_of_content: PropTypes.string,
      spatial_resolution: PropTypes.string,
    }).isRequired,
    language: PropTypes.string.isRequired,
  }).isRequired,
};

export default FurtherInformationComponent;

import React from 'react';
import PropTypes from 'prop-types';
import ReadMore from 'components/ui/read-more';
import ReactMarkdown from 'react-markdown';

// Constants
import { DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS } from 'layout/explore/explore-detail/constants';

// Utils
import { logEvent } from 'utils/analytics';

// Styles
import './styles.scss';

function FurtherInformationComponent(props) {
  const {
    metadata: {
      info: {
        technical_title,
        cautions, citation,
        sources,
        geographic_coverage,
        frequency_of_updates
      },
      language
    }
  } = props;

  return (
    <div className="c-further-information">
      <h3>Further information</h3>
      {technical_title && (
        <div className="metadata-field">
          <h4>Formal name</h4>
          <p>{technical_title}</p>
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
      {sources && (
        <div className="metadata-field">
          <h4>Sources</h4>
          {
              sources.map(source => (
                <div key={source['source-name']}>
                  {source['source-name']}
                  {source['source-description']}
                </div>))
          }
        </div>
      )}
      <div className="row" >
        <div className="column small-6">
          <div className="metadata-field">
            <h4>Geographic coverage</h4>
            <ReactMarkdown linkTarget="_blank" source={geographic_coverage} />
          </div>
        </div>
        <div className="column small-6">
          <div className="metadata-field">
            <h4>Frequency of updates</h4>
            <ReactMarkdown linkTarget="_blank" source={frequency_of_updates} />
          </div>
        </div>
        <div className="column small-6">
          <div className="metadata-field">
            <h4>Published language</h4>
            <ReactMarkdown linkTarget="_blank" source={language} />
          </div>
        </div>
      </div>
    </div>
  );
}

FurtherInformationComponent.propTypes = { metadata: PropTypes.object.isRequired };

export default FurtherInformationComponent;

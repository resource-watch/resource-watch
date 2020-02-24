import React from 'react';
import PropTypes from 'prop-types';
import ReadMore from 'components/ui/ReadMore';

// Constants
import { DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS } from 'layout/explore/explore-detail/constants';

// Styles
import './styles.scss';

function FurtherInformationComponent(props) {
  const { metadata: { info: { technical_title, cautions, citation, sources } } } = props;
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
    </div>
  );
}

FurtherInformationComponent.propTypes = { metadata: PropTypes.object.isRequired };

export default FurtherInformationComponent;

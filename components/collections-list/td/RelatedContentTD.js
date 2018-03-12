import React from 'react';
import PropTypes from 'prop-types';

import CollectionsRelatedContent from '../related-content';

function RelatedContentTD(props) {
  const { index } = props;
  return (
    <td key={index} className="c-related-content">
      <CollectionsRelatedContent {...props} />
    </td>
  );
}

RelatedContentTD.propTypes = {
  index: PropTypes.number
};

export default RelatedContentTD;

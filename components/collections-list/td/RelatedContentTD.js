import React from 'react';

import CollectionsRelatedContent from '../related-content';

function RelatedContentTD(props) {
  const { index } = props;
  return (
    <td key={index} className="main">
      <CollectionsRelatedContent {...props} />
    </td>
  );
}

export default RelatedContentTD;

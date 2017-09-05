import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetsRelatedContent from 'components/datasets/common/DatasetsRelatedContent';

function RelatedContentTD(props) {
  const { row, index, route } = props;

  return (
    <td key={index}>
      <DatasetsRelatedContent
        dataset={row}
        route={route}
      />
    </td>
  );
}

RelatedContentTD.propTypes = {
  row: PropTypes.object,
  route: PropTypes.string,
  index: PropTypes.string
};

export default RelatedContentTD;

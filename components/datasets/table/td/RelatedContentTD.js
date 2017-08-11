import React from 'react';

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
  row: React.PropTypes.object,
  route: React.PropTypes.string,
  index: React.PropTypes.string
};

export default RelatedContentTD;

import React from 'react';
import PropTypes from 'prop-types';

// Next components
import { Link } from 'routes';

function NameTD(props) {
  const { row, value, dataset, index } = props;

  return (
    <td key={index} className="main">
      <Link
        route="admin_data_detail"
        params={{
          tab: 'widgets',
          subtab: 'edit',
          id: row.id,
          ...!!dataset && { dataset }
        }}
      >
        <a>{value}</a>
      </Link>
    </td>
  );
}

NameTD.propTypes = {
  row: PropTypes.object,
  value: PropTypes.string,
  dataset: PropTypes.string,
  index: PropTypes.string
};

export default NameTD;

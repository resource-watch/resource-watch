import React from 'react';
import PropTypes from 'prop-types';

// Next components
import { Link } from 'routes';

function NameTD(props) {
  const { row, value, index, route } = props;
  return (
    <td key={index} className="main">
      <Link route={route} params={{ tab: 'collections', id: row.id }}>
        <a>{value}</a>
      </Link>
    </td>
  );
}

NameTD.propTypes = {
  row: PropTypes.object.isRequired,
  route: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  index: PropTypes.string.isRequired
};

export default NameTD;

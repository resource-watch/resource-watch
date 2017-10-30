import React from 'react';
import PropTypes from 'prop-types';

function OwnerTD(props) {
  const { value, index } = props;

  return (
    <td key={index} className="main">
      {value.email}
    </td>
  );
}

OwnerTD.propTypes = {
  value: PropTypes.string,
  index: PropTypes.string
};

export default OwnerTD;

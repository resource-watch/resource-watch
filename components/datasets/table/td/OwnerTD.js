import React from 'react';
import PropTypes from 'prop-types';

function OwnerTD(props) {
  const { value, index } = props;
  const emailSt = value ? value.email : '';

  return (
    <td key={index} className="main">
      {emailSt}
    </td>
  );
}

OwnerTD.propTypes = {
  value: PropTypes.string,
  index: PropTypes.string
};

export default OwnerTD;

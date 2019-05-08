import React from 'react';
import PropTypes from 'prop-types';

function RoleTD(props) {
  const { value, index } = props;

  return (
    <td key={index}>
      {value}
    </td>
  );
}

RoleTD.propTypes = {
  value: PropTypes.string,
  index: PropTypes.string
};

export default RoleTD;

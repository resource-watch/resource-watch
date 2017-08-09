import React from 'react';
import PropTypes from 'prop-types';

function UpdatedAtTD(props) {
  const { value, index } = props;

  return (
    <td key={index}>
      {new Date(value).toLocaleString()}
    </td>
  );
}

UpdatedAtTD.propTypes = {
  value: PropTypes.string,
  index: PropTypes.string
};

export default UpdatedAtTD;

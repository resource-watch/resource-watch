import React from 'react';
import PropTypes from 'prop-types';

function PublishedTD(props) {
  const { value, index } = props;

  return (
    <td key={index}>
      {(value) ? 'true' : 'false' }
    </td>
  );
}

PublishedTD.propTypes = {
  value: PropTypes.bool,
  index: PropTypes.string
};

export default PublishedTD;

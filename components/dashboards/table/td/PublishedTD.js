import React from 'react';
import PropTypes from 'prop-types';

function PublishedTD(props) {
  const { value, index } = props;

  return (
    <td className="boolean" key={index}>
      {(value) ? <span className="-true">Yes</span> : <span className="-false">No</span> }
    </td>
  );
}

PublishedTD.propTypes = {
  value: PropTypes.bool,
  index: PropTypes.string
};

export default PublishedTD;

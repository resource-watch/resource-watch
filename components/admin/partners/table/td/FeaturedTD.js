import React from 'react';
import PropTypes from 'prop-types';

function FeaturedTD(props) {
  const { value, index } = props;

  return (
    <td className="boolean" key={index}>
      {(value) ? <span className="-true">Yes</span> : <span className="-false">No</span> }
    </td>
  );
}

FeaturedTD.propTypes = {
  value: PropTypes.bool,
  index: PropTypes.string
};

export default FeaturedTD;

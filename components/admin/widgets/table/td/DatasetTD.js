import React from 'react';
import PropTypes from 'prop-types';

function DatasetTD(props) {
  const { value, index } = props;

  console.log(value);

  return (
    <td className="boolean" key={index}>
      {(value) ? <span className="-true">Yes</span> : <span className="-false">No</span> }
    </td>
  );
}

DatasetTD.propTypes = {
  value: PropTypes.bool,
  index: PropTypes.string
};

export default DatasetTD;

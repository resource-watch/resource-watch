import React from 'react';
import PropTypes from 'prop-types';

function OwnershipTD(props) {
  const { user, index, row } = props;
  const { userId } = row;
  const { id } = user;

  return (
    <td className="boolean" key={index}>
      {(userId === id) ? <span className="-true">Me</span> : <span className="-false">Others</span> }
    </td>
  );
}

OwnershipTD.propTypes = {
  index: PropTypes.string,
  user: PropTypes.object,
  row: PropTypes.object
};

export default OwnershipTD;

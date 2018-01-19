import React from 'react';
import PropTypes from 'prop-types';

const classesDic = {
  status: {
    success: '-success',
    failed: '-failed',
    saved: '-saved',
    deleted: '-deleted',
    pending: '-pending'
  }
};

function StatusTD(props) {
  const { value, index } = props;
  const className = `status ${classesDic.status[value]}`;
  return (
    <td
      className={className}
      key={index}
    >
      {value}
    </td>
  );
}

StatusTD.propTypes = {
  value: PropTypes.string,
  index: PropTypes.string
};

export default StatusTD;

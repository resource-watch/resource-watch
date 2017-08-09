import React from 'react';

const classesDic = {
  status: {
    success: '-success',
    failed: '-failed',
    saved: '-saved',
    deleted: '-deleted',
    pending: '-pending'
  }
};

class StatusTD extends React.Component {

  render() {
    const { value, index } = this.props;
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
}

StatusTD.propTypes = {
  value: React.PropTypes.string,
  index: React.PropTypes.string
};

export default StatusTD;

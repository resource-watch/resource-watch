import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const classesDic = {
  status: {
    success: '-success',
    failed: '-failed',
    saved: '-saved',
    deleted: '-deleted',
    pending: '-pending'
  }
};

class StatusTD extends PureComponent {
  static propTypes = { value: PropTypes.string.isRequired }

  render() {
    const { value } = this.props;
    const tdClass = classnames(
      'status',
      { [classesDic.status[value]]: !!classesDic.status[value] }
    );

    return (
      <td className={tdClass}>
        {value}
      </td>
    );
  }
}

export default StatusTD;

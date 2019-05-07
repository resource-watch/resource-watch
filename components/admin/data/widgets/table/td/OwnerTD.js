import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class OwnerTD extends PureComponent {
  static propTypes = { row: PropTypes.object.isRequired }

  render() {
    const { row: { user } } = this.props;
    const userName = user ? user.name || (user.email || '').split('@')[0] : '';

    return (
      <td>
        {userName}
      </td>
    );
  }
}

export default OwnerTD;

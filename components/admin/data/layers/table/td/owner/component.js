import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class OwnerTD extends PureComponent {
  static propTypes = { row: PropTypes.object.isRequired }

  render() {
    const { row: { user } } = this.props;

    return (
      <td>
        {(user || {}).name || ''}
      </td>
    );
  }
}

export default OwnerTD;

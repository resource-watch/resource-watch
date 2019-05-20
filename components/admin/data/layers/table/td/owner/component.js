import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class OwnerTD extends PureComponent {
  static propTypes = { row: PropTypes.object.isRequired }

  render() {
    const { row: { owner } } = this.props;

    return (
      <td>
        {owner}
      </td>
    );
  }
}

export default OwnerTD;

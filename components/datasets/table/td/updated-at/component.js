import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class UpdatedAtTD extends PureComponent {
  static propTypes = { value: PropTypes.string.isRequired }

  render() {
    const { value } = this.props;

    return (
      <td>
        {new Date(value).toLocaleString()}
      </td>
    );
  }
}

export default UpdatedAtTD;

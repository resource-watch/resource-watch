import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class OwnerTD extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    index: PropTypes.string,
  }

  static defaultProps = {
    value: null,
    index: null,
  }

  render() {
    const { index, value } = this.props;

    return (
      <td key={index}>
        {value}
      </td>
    );
  }
}

export default OwnerTD;

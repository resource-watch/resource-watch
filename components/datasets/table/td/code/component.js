import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class CodeTD extends PureComponent {
  static propTypes = { row: PropTypes.object.isRequired }

  render() {
    const { row: { metadata } } = this.props;
    const code = metadata && (metadata[0] || {}).info ? metadata[0].info.rwId : '';

    return (
      <td>
        <span>{code}</span>
      </td>
    );
  }
}

export default CodeTD;

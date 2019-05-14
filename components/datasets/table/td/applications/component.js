import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ApplicationsTD extends PureComponent {
  static propTypes = { row: PropTypes.object.isRequired }

  render() {
    const { row: { application } } = this.props;

    return (
      <td>
        <span>{application.join(', ')}</span>
      </td>
    );
  }
}

export default ApplicationsTD;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ApplicationsTD extends PureComponent {
  static propTypes = { row: PropTypes.object.isRequired }

  render() {
    const { row: { application } } = this.props;

    return (
      <td>
        {application.map(app => <span className="applications">{app}</span>)}
      </td>
    );
  }
}

export default ApplicationsTD;

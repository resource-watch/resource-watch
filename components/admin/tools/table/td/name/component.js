import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Next components
import { Link } from 'routes';

class NameTD extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    index: PropTypes.string.isRequired,
  }

  render() {
    const { row, value, index } = this.props;
    return (
      <td key={index} className="main">
        <Link route="admin_tools_detail" params={{ tab: 'tools', id: row.id }}>
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

export default NameTD;

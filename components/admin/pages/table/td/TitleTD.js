import React from 'react';
import PropTypes from 'prop-types';

// Next components
import { Link } from 'routes';

class NameTD extends React.Component {
  render() {
    const { row, value, index } = this.props;

    return (
      <td key={index} className="main">
        <Link route="admin_pages_detail" params={{ tab: 'pages', id: row.id }}>
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

NameTD.propTypes = {
  row: PropTypes.object,
  value: PropTypes.string,
  index: PropTypes.string
};

export default NameTD;

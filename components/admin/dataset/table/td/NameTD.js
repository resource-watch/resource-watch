import React from 'react';

// Next components
import { Link } from 'routes';

class NameTD extends React.Component {

  render() {
    const { row, value, index } = this.props;

    return (
      <td key={index} className="main">
        <Link route="admin_data_detail" params={{ tab: 'datasets', id: row.id }}>
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

NameTD.propTypes = {
  row: React.PropTypes.object,
  value: React.PropTypes.string,
  index: React.PropTypes.string
};

export default NameTD;

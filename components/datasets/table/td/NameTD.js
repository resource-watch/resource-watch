import React from 'react';

// Next components
import { Link } from 'routes';

class NameTD extends React.Component {

  render() {
    const { row, value, index, route } = this.props;

    return (
      <td key={index} className="main">
        <Link route={route} params={{ tab: 'datasets', id: row.id }}>
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

NameTD.propTypes = {
  row: React.PropTypes.object,
  route: React.PropTypes.string,
  value: React.PropTypes.string,
  index: React.PropTypes.string
};

export default NameTD;

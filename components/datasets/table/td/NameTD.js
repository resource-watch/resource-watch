import React from 'react';
import PropTypes from 'prop-types';

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
  row: PropTypes.object,
  route: PropTypes.string,
  value: PropTypes.string,
  index: PropTypes.string
};

export default NameTD;

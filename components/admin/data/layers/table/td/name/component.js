import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

class NameTD extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired
  }

  render() {
    const {
      row: { id, dataset },
      value
    } = this.props;

    return (
      <td className="main">
        <Link
          route="admin_data_detail"
          params={{
            tab: 'layers',
            subtab: 'edit',
            id,
            dataset
          }}
        >
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

export default NameTD;

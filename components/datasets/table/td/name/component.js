import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

class NameTD extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    route: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }

  render() {
    const {
      row: { id },
      value,
      route,
    } = this.props;

    return (
      <td className="main">
        <Link
          route={route}
          params={{
            tab: 'datasets',
            id,
          }}
        >
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

export default NameTD;

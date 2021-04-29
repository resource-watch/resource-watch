import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

class NameTD extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
  }

  render() {
    const {
      row: { id },
      value,
    } = this.props;

    return (
      <td className="main">
        <Link href={`/admin/data/datasets/${id}`}>
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

export default NameTD;

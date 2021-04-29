import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

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
        <Link href={`/admin/tools/tools/${row.id}`}>
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

export default NameTD;

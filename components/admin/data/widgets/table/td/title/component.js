import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

class TitleTD extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
  }

  render() {
    const {
      row: { id, dataset },
      value,
    } = this.props;

    return (
      <td className="main">
        <Link href={`/admin/data/widgets/${id}/edit?dataset=${dataset}`}>
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

export default TitleTD;

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// utils
import { substitution } from 'utils/utils';

class EditAction extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    action: PropTypes.object.isRequired,
  }

  getParsedParams() {
    const {
      data: { id },
      action: { params },
    } = this.props;

    return JSON.parse(substitution(JSON.stringify(params), [{ key: 'id', value: id }]));
  }

  render() {
    const {
      data: { status },
    } = this.props;

    const {
      tab,
      subtab,
      id,
    } = this.getParsedParams();

    return (
      <span>
        {(status === 'saved')
          && (
          <Link href={`/admin/data/${tab}/${id}/${subtab}`}>
            <a className="c-btn">Edit</a>
          </Link>
          )}
      </span>
    );
  }
}

export default EditAction;

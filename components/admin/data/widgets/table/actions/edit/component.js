import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

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
    const { action: { route } } = this.props;

    return (
      <Link
        route={route}
        params={this.getParsedParams()}
      >
        <a className="c-btn">Edit</a>
      </Link>
    );
  }
}

export default EditAction;

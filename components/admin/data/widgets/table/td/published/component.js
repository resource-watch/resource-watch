import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PublishedTD extends PureComponent {
  static propTypes = { value: PropTypes.bool.isRequired }

  render() {
    const { value } = this.props;

    return (
      <td className="boolean">
        <span>{value ? 'Yes' : 'No'}</span>
      </td>
    );
  }
}

export default PublishedTD;

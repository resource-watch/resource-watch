import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class FeaturedTD extends PureComponent {
  static propTypes = { value: PropTypes.bool.isRequired }

  render() {
    const { value } = this.props;

    return (
      <td>
        {(value) ? 'Yes' : 'No' }
      </td>
    );
  }
}

export default FeaturedTD;

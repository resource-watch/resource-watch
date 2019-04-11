import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import PartnersTable from 'components/admin/partners/table';

class PartnersIndex extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  render() {
    const { user: { token } } = this.props;

    return (
      <PartnersTable authorization={token} />
    );
  }
}

export default PartnersIndex;

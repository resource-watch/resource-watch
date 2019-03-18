import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayoutAdminPartners from 'layout/admin/partners';

class AdminPartnersPage extends PureComponent {
  static propTypes = { getAllPartners: PropTypes.func.isRequired }

  componentWillMount() {
    const { getAllPartners } = this.props;

    getAllPartners();
  }

  render() {
    return (
      <LayoutAdminPartners />
    );
  }
}

export default AdminPartnersPage;

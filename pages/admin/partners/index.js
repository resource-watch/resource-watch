import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { getAllPartners } from 'modules/partners/actions';

// components
import LayoutAdminPartners from 'layout/admin/partners';

class AdminPartnersPage extends PureComponent {
  static propTypes = { getAllPartners: PropTypes.func.isRequired }

  componentWillMount() {
    this.props.getAllPartners();
  }

  render() {
    return (<LayoutAdminPartners />);
  }
}

export default connect(
  null,
  { getAllPartners }
)(AdminPartnersPage);

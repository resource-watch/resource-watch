import {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { getAllPartners } from 'modules/partners/actions';

// components
import LayoutAdminPartners from 'layout/admin/partners';

const AdminPartnersPage = ({
  getAllPartners: getAllPartnersAction,
}) => {
  useEffect(() => { getAllPartnersAction(); }, [getAllPartnersAction]);

  return (<LayoutAdminPartners />);
};

AdminPartnersPage.propTypes = {
  getAllPartners: PropTypes.func.isRequired,
};

export default connect(
  null,
  { getAllPartners },
)(AdminPartnersPage);

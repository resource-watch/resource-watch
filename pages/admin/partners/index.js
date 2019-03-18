import { connect } from 'react-redux';

// actions
import { getAllPartners } from 'modules/partners/actions';

// component
import AdminPartnersPage from './component';

export default connect(
  null,
  { getAllPartners }
)(AdminPartnersPage);

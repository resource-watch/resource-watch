import { connect } from 'react-redux';

// component
import LayoutAdminPartnersDetail from './component';

export default connect(
  (state) => ({
    query: state.routes.query,
    user: state.user,
  }),
  null,
)(LayoutAdminPartnersDetail);

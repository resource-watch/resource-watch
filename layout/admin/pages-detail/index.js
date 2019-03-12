import { connect } from 'react-redux';

// component
import LayoutAdminPagesDetail from './component';

export default connect(
  state => ({
    query: state.routes.query,
    user: state.user
  }),
  null
)(LayoutAdminPagesDetail);

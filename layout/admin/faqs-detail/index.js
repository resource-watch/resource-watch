import { connect } from 'react-redux';

// component
import LayoutAdminFaqsDetail from './component';

export default connect(
  (state) => ({
    query: state.routes.query,
    user: state.user,
  }),
  null,
)(LayoutAdminFaqsDetail);

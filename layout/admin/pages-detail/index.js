import { connect } from 'react-redux';

// component
import LayoutAdminStaticPagesDetail from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(LayoutAdminStaticPagesDetail);

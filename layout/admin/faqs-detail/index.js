import { connect } from 'react-redux';

// component
import LayoutAdminFaqsDetail from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(LayoutAdminFaqsDetail);

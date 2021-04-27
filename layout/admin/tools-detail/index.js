import { connect } from 'react-redux';

// component
import LayoutAdminToolsDetail from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(LayoutAdminToolsDetail);

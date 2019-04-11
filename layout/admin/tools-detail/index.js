import { connect } from 'react-redux';

// component
import LayoutAdminToolsDetail from './component';

export default connect(
  state => ({
    query: state.routes.query,
    user: state.user
  }),
  null
)(LayoutAdminToolsDetail);

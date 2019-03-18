import { connect } from 'react-redux';

// component
import LayoutAdminDataDetail from './component';

export default connect(
  state => ({
    query: state.routes.query,
    user: state.user,
    locale: state.common.locale
  }),
  null
)(LayoutAdminDataDetail);

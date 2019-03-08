import { connect } from 'react-redux';

import LayoutAdminData from './component';

export default connect(
  state => ({ query: state.routes.query }),
  null
)(LayoutAdminData);

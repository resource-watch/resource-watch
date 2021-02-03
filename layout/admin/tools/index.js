import { connect } from 'react-redux';

import LayoutAdminTools from './component';

export default connect(
  (state) => ({ query: state.routes.query }),
  null,
)(LayoutAdminTools);

import { connect } from 'react-redux';

import LayoutAdminPages from './component';

export default connect(
  state => ({ query: state.routes.query }),
  null
)(LayoutAdminPages);

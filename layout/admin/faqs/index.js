import { connect } from 'react-redux';

import LayoutAdminFaqs from './component';

export default connect(
  (state) => ({ query: state.routes.query }),
  null,
)(LayoutAdminFaqs);

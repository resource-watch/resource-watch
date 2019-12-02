import { connect } from 'react-redux';

import DashboardsLayout from './component';

export default connect(
  state => ({ data: state.staticPages.topics }),
  null
)(DashboardsLayout);

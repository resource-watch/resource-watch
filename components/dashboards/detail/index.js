
import { connect } from 'react-redux';

// component
import DashboardDetail from './component';

export default connect(
  state => ({ dashboard: state.dashboards.detail.data }),
  null
)(DashboardDetail);

import { connect } from 'react-redux';

// component
import LayoutEmbedDashboard from './component';

export default connect(
  (state) => ({ dashboard: state.dashboards.detail.data }),
  null,
)(LayoutEmbedDashboard);

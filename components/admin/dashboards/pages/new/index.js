import { connect } from 'react-redux';

// component
import DashboardNew from './component';

export default connect(
  state => ({ user: state.user }),
  null
)(DashboardNew);

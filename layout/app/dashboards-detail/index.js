// Redux
import { connect } from 'react-redux';

// component
import DashboardDetailLayout from './component';

export default connect(
  state => ({ topicsDetail: state.topics.detail.data }),
  null
)(DashboardDetailLayout);

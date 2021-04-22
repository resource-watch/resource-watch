import { connect } from 'react-redux';

// component
import ImportDashboardSelector from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(ImportDashboardSelector);

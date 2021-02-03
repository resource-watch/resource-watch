import { connect } from 'react-redux';

// component
import WidgetsIndex from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(WidgetsIndex);

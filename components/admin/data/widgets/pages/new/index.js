import { connect } from 'react-redux';

// component
import WidgetsNew from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(WidgetsNew);

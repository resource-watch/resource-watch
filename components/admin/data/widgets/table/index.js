import { connect } from 'react-redux';

// component
import WidgetsTable from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(WidgetsTable);

import { connect } from 'react-redux';

// component
import LayersTable from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(LayersTable);

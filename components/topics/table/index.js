import { connect } from 'react-redux';

// component
import ToolsTable from './component';

export default connect(
  state => ({ user: state.user }),
  null
)(ToolsTable);

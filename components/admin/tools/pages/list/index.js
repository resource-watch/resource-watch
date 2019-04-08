import { connect } from 'react-redux';

// component
import ToolsIndex from './component';

export default connect(
  state => ({ user: state.user }),
  null
)(ToolsIndex);

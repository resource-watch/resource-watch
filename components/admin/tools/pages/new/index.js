import { connect } from 'react-redux';

// component
import ToolsNew from './component';

export default connect(
  state => ({ user: state.user }),
  null
)(ToolsNew);

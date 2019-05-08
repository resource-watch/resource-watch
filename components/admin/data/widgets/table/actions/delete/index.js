import { connect } from 'react-redux';

// component
import DeleteAction from './component';

export default connect(
  state => ({ user: state.user }),
  null
)(DeleteAction);

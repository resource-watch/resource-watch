import { connect } from 'react-redux';

// component
import DeleteAction from './component';

export default connect(
  (state) => ({ token: state.user.token }),
  null,
)(DeleteAction);

import { connect } from 'react-redux';

import DeleteAction from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(DeleteAction);

import { connect } from 'react-redux';

// component
import AreasEdit from './component';

export default connect(
  (state) => ({ token: state.user.token }),
  null,
)(AreasEdit);

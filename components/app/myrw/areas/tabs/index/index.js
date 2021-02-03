import { connect } from 'react-redux';

// component
import AreasIndex from './component';

export default connect(
  (state) => ({ token: state.user.token }),
  null,
)(AreasIndex);

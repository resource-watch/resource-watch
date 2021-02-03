import { connect } from 'react-redux';

// component
import AreasNew from './component';

export default connect(
  (state) => ({ token: state.user.token }),
  null,
)(AreasNew);

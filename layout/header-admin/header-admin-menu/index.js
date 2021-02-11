import { connect } from 'react-redux';

// component
import AdminHeaderMenu from './component';

export default connect(
  (state) => ({ routes: state.routes }),
  null,
)(AdminHeaderMenu);

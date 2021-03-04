import { connect } from 'react-redux';

// component
import HeaderUser from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(HeaderUser);

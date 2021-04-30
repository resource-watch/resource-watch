import { connect } from 'react-redux';

// component
import HeaderMenu from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(HeaderMenu);

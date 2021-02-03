import { connect } from 'react-redux';

// component
import HeaderMenu from './component';

export default connect(
  (state) => ({
    routes: state.routes,
    user: state.user,
  }),
  null,
)(HeaderMenu);

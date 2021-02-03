import { connect } from 'react-redux';

// actions
import { setUser } from 'redactions/user';

// component
import Profile from './component';

export default connect(
  (state) => ({ user: state.user }),
  { setUser },
)(Profile);

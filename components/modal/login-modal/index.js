import { connect } from 'react-redux';

// actions
import { setUser } from 'redactions/user';

// component
import LoginModal from './component';

export default connect(
  null,
  { setUser }
)(LoginModal);

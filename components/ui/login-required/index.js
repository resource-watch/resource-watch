import { connect } from 'react-redux';

// component
import LoginRequired from './component';

export default connect(
  state => ({ user: state.user }),
  null
)(LoginRequired);

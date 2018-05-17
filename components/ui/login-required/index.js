import { connect } from 'react-redux';
import LoginRequiredComponent from './login-required-component';

export default connect(
  state => ({
    user: state.user,
    isOpen: state.isOpen
  }),
  null
)(LoginRequiredComponent);

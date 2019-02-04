// Redux
import { connect } from 'react-redux';

// actions
import { setUser } from 'redactions/user';

// component
import SigIn from './component';

export default connect(
  null,
  { setUser }
)(SigIn);

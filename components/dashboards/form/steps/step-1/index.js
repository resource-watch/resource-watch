import { connect } from 'react-redux';

// component
import Step1 from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(Step1);

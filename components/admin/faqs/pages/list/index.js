import { connect } from 'react-redux';

// component
import FaqsIndex from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(FaqsIndex);

import { connect } from 'react-redux';

// component
import FaqsNew from './component';

export default connect(
  (state) => ({ user: state.user }),
)(FaqsNew);

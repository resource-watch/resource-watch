import { connect } from 'react-redux';

// component
import AreasTabs from './component';

export default connect(
  state => ({ user: state.user }),
  null
)(AreasTabs);

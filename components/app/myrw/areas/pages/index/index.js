import { connect } from 'react-redux';

// component
import AreasIndex from './component';

export default connect(
  state => ({ areas: state.user.areas.items }),
  null
)(AreasIndex);

import { connect } from 'react-redux';
import ExploreFormComponent from './component';

export default connect(
  state => ({ token: state.user.token }),
  null
)(ExploreFormComponent);

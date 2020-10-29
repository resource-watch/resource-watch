import { connect } from 'react-redux';

// component
import CollectionsIndex from './component';

export default connect(
  (state) => ({ token: state.user.token }),
  null,
)(CollectionsIndex);

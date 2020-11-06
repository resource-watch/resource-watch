import { connect } from 'react-redux';

// component
import CollectionsEdit from './component';

export default connect(
  (state) => ({ token: state.user.token }),
  null,
)(CollectionsEdit);

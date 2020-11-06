import { connect } from 'react-redux';

// component
import CollectionsNew from './component';

export default connect(
  (state) => ({ token: state.user.token }),
  null,
)(CollectionsNew);

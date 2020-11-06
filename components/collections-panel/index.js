import { connect } from 'react-redux';

// component
import CollectionsPanel from './component';

export default connect(
  (state) => ({
    token: state.user.token,
  }),
  null,
)(CollectionsPanel);

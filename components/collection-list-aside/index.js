import { connect } from 'react-redux';

// component
import CollectionListAside from './component';

export default connect(
  (state) => ({
    token: state.user.token,
  }),
  null,
)(CollectionListAside);

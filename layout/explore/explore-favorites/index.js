import { connect } from 'react-redux';

// component
import ExploreFavorites from './component';

export default connect(
  (state) => ({
    userToken: state.user.token,
  }),
  null,
)(ExploreFavorites);

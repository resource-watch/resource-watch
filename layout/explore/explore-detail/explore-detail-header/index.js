import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

// component
import ExploreDetailHeaderComponent from './component';

export default connect(
  (state) => ({
    userIsLoggedIn: !!state.user.token
  }),
  actions
)(ExploreDetailHeaderComponent);

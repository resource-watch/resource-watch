import { connect } from 'react-redux';
import * as actions from './actions';

// component
import LayoutExplore from './component';

export default connect(
  (state) => ({
    explore: state.explore,
    userIsLoggedIn: !!state.user.id,
  }),
  actions,
)(LayoutExplore);

import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

// component
import Header from './component';

export { actions, reducers, initialState };

export default connect(
  (state) => ({
    header: state.header,
    user: state.user,
  }),
  actions,
)(Header);

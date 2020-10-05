import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducer';
import initialState from './initial-state';

// component
import InteractionManager from './component';

export { actions, reducers, initialState };

export default connect(
  (state) => ({
    user: state.user,
    interactions: state.interactions,
  }),
  actions,
)(InteractionManager);

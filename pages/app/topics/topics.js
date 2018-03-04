// Redux
import { connect } from 'react-redux';
import * as actions from './topics-actions';
import * as reducers from './topics-reducers';
import initialState from './topics-default-state';

import TopicsComponent from './topics-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    topics: state.topics
  }),
  actions
)(TopicsComponent);

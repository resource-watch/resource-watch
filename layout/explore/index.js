// Redux
import { connect } from 'react-redux';
import * as actions from './explore-actions';
import * as reducers from './explore-reducers';
import initialState from './explore-default-state';

import ExploreComponent from './explore-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    explore: state.explore
  }),
  actions
)(ExploreComponent);

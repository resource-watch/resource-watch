// Redux
import { connect } from 'react-redux';
import * as actions from './explore-actions';
import * as reducers from './explore-reducers';
import initialState from './explore-default-state';

import ExploreEmbedComponent from './explore-embed-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    responsive: state.responsive
  }),
  actions
)(ExploreEmbedComponent);

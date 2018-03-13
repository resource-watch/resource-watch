// Redux
import { connect } from 'react-redux';
import * as actions from './search-actions';
import * as reducers from './search-reducers';
import initialState from './search-default-state';

import SearchComponent from './search-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    ...state.search
  }),
  actions
)(SearchComponent);

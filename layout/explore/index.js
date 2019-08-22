import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

// component
import LayoutExplore from './component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({ responsive: state.responsive }),
  actions
)(LayoutExplore);

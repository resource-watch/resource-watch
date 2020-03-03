import { connect } from 'react-redux';

// Components
import DatasetListItemComponent from './component';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

import { isActive } from './selectors';

export { actions, reducers, initialState };

export default connect(
  (state, props) => ({
    user: state.user,
    responsive: state.responsive,
    active: isActive(state, props)
  }),
  actions
)(DatasetListItemComponent);

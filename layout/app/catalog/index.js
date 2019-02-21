// Redux
import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './default-state';

import CatalogLayout from './component';

export { actions, reducers, initialState };

export default connect(
  state => ({ ...state.catalog }),
  actions
)(CatalogLayout);

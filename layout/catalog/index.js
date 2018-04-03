// Redux
import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './default-state';

import CatalogComponent from './component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    ...state.catalog
  }),
  actions
)(CatalogComponent);

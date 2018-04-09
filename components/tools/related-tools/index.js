import { connect } from 'react-redux';

import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

import RelatedToolsComponent from './component';

export { actions, reducers, initialState };

export default connect(
  state => ({
    ...state.relatedTools
  }),
  actions
)(RelatedToolsComponent);

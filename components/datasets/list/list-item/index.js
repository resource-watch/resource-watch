import { connect } from 'react-redux';

// Components
import DatasetListItemComponent from './component';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

export { actions, reducers, initialState };

export default connect(
  state => ({
    user: state.user,
    ...state.datasetListItem
  }),
  actions
)(DatasetListItemComponent);

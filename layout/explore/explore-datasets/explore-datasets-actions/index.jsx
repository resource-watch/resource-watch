import { connect } from 'react-redux';

// actions
import * as actions from 'layout/explore/actions';

// component
import ExploreDatasetsActions from './component';

export default connect(
  (state) => ({
    ...state.explore.map,
    user: state.user,
    selectedCollection: state.explore.sidebar.selectedCollection,
  }),
  actions,
)(ExploreDatasetsActions);

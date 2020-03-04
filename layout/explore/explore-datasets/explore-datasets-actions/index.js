// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreDatasetsActionsComponent from './component';

export default connect(
  state => ({
    ...state.explore.map,
    user: state.user
  }),
  actions
)(ExploreDatasetsActionsComponent);

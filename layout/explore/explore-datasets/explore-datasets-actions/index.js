// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreDatasetsActionsComponent from './explore-datasets-actions-component';

export default connect(
  state => ({
    ...state.explore.map
  }),
  actions
)(ExploreDatasetsActionsComponent);

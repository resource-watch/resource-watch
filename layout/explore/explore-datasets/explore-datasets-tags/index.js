// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreDatasetsTagsComponent from './component';

export default connect(
  state => ({
    ...state.explore.filters,
    ...state.explore.tags
  }),
  actions
)(ExploreDatasetsTagsComponent);

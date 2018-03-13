// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreSidebarComponent from './explore-sidebar-component';

export default connect(
  state => ({
    loading: state.explore.datasets.loading,
    ...state.explore.sidebar
  }),
  actions
)(ExploreSidebarComponent);

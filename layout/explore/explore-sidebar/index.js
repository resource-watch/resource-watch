// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreSidebarComponent from './explore-sidebar-component';

export default connect(
  state => ({ ...state.explore.sidebar }),
  actions
)(ExploreSidebarComponent);

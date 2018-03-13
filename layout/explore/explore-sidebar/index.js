// Redux
import { connect } from 'react-redux';
import * as actions from '../explore-actions';

import ExploreSidebarComponent from './explore-sidebar-component';

export default connect(
  state => ({
    // Store
    ...state.explore.sidebar
  }),
  actions
)(ExploreSidebarComponent);

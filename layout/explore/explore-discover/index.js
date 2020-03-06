// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreDiscoverComponent from './component';

export default connect(
  null,
  actions
)(ExploreDiscoverComponent);

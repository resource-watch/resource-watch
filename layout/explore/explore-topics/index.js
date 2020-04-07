// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import ExploreTopicsComponent from './component';

export default connect(
  state => null,
  actions
)(ExploreTopicsComponent);


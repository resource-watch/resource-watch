import { connect } from 'react-redux';

// actions
import * as actions from 'layout/explore/actions';

// component
import ExploreTopicsComponent from './component';

export default connect(
  null,
  actions,
)(ExploreTopicsComponent);

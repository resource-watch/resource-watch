// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

import { getCollection } from './selectors';
import ExploreCollectionsComponent from './component';

export default connect(
  state => ({ collection: getCollection(state) }),
  actions
)(ExploreCollectionsComponent);

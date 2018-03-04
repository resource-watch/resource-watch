// Redux
import { connect } from 'react-redux';
import * as actions from './topics-detail-actions';
import * as reducers from './topics-detail-reducers';
import initialState from './topics-detail-default-state';

import TopicDetailComponent from './topics-detail-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    // Store
    topicDetail: state.topicDetail
  }),
  actions
)(TopicDetailComponent);

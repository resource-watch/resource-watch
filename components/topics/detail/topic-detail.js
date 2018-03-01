import { connect } from 'react-redux';
import * as actions from './topic-detail-actions';
import * as reducers from './topic-detail-reducers';
import initialState from './topic-detail-default-state';

import TopicDetail from './topic-detail-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    topicDetail: state.topicDetail
  }),
  actions
)(TopicDetail);

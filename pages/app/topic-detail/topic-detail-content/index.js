import { connect } from 'react-redux';

import TopicDetailContentComponent from './topic-detail-content-component';

export default connect(
  state => ({
    topic: state.topicDetail.data,
    user: state.user
  }),
  null
)(TopicDetailContentComponent);

import { connect } from 'react-redux';

import TopicDetailContentComponent from './topics-detail-content-component';

export default connect(
  state => ({
    topic: state.topicDetail.data,
    user: state.user
  }),
  null
)(TopicDetailContentComponent);

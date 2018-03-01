import { connect } from 'react-redux';

import TopicDetailHeaderComponent from './topic-detail-header-component';

export default connect(
  state => ({
    topic: state.topicDetail.data,
    user: state.user
  }),
  null
)(TopicDetailHeaderComponent);

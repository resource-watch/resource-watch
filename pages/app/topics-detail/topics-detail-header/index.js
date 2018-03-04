import { connect } from 'react-redux';

import TopicDetailHeaderComponent from './topics-detail-header-component';

export default connect(
  state => ({
    topic: state.topicDetail.data,
    user: state.user
  }),
  null
)(TopicDetailHeaderComponent);

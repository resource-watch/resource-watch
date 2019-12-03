import { connect } from 'react-redux';

import TopicDetailHeaderComponent from './component';

export default connect(
  state => ({
    topic: state.topics.detail.data,
    user: state.user
  }),
  null
)(TopicDetailHeaderComponent);

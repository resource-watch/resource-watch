import { connect } from 'react-redux';

import TopicDetailContentComponent from './component';

export default connect(
  state => ({
    topic: state.topics.detail.data,
    user: state.user
  }),
  null
)(TopicDetailContentComponent);

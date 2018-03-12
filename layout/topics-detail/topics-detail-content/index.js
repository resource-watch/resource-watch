import { connect } from 'react-redux';

import TopicDetailContentComponent from './topics-detail-content-component';

export default connect(
  state => ({
    topic: state.topicsDetail.data,
    user: state.user
  }),
  null
)(TopicDetailContentComponent);

// Redux
import { connect } from 'react-redux';

// component
import TopicDetailLayout from './component';

export default connect(
  state => ({ topicsDetail: state.topics.detail.data }),
  null
)(TopicDetailLayout);

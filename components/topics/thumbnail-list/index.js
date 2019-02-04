import { connect } from 'react-redux';

// component
import TopicThumbnailList from './component';

export default connect(
  state => ({
    topics: state.topics.published.data,
    selected: state.topics.thumbnails.selected
  }),
  null
)(TopicThumbnailList);

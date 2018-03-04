import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './default-state';

import TopicThumbnailList from './component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    topics: state.topicThumbnailList.topics,
    selected: state.topicThumbnailList.selected
  }),
  actions
)(TopicThumbnailList);

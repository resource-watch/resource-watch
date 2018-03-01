import { connect } from 'react-redux';
import * as actions from './topic-thumbnail-list-actions';
import * as reducers from './topic-thumbnail-list-reducers';
import initialState from './topic-thumbnail-list-default-state';
import { getFilteredTopics } from './topic-thumbnail-list-selectors';

import TopicThumbnailList from './topic-thumbnail-list-component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  state => ({
    topics: getFilteredTopics(state),
    total: state.topicThumbnailList.total,
    pagination: state.topicThumbnailList.pagination,
    add: state.topicThumbnailList.add,
    selected: state.topicThumbnailList.selected,
    expanded: state.topicThumbnailList.expanded
  }),
  actions
)(TopicThumbnailList);

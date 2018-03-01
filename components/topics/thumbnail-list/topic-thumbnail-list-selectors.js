import { createSelector } from 'reselect';

const getTopics = state => state.topicThumbnailList.topics;
const getExpanded = state => state.topicThumbnailList.expanded;
const getPagination = state => state.topicThumbnailList.pagination;

const filterTopics = (topics, expanded, pagination) => {
  if (pagination && !expanded) {
    return topics.slice(0, 5);
  }

  return topics;
};

export const getFilteredTopics = createSelector(
  [getTopics, getExpanded, getPagination],
  filterTopics
);

export default {
  getFilteredTopics
};

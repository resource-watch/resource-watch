import { createSelector } from 'reselect';

// states
const getPublishedTopics = state => state.topics.published.data;

export const parseTopics = createSelector(
  [getPublishedTopics], _topics => _topics
    .map(_topic => ({
      label: _topic.name,
      route: 'dashboards_detail',
      params: { slug: _topic.slug, topic: true }
    }))
);

export default { parseTopics };

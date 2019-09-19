import { createSelector } from 'reselect';

// states
const getPublishedTopics = state => state.topics.published.data;

export const parseTopics = createSelector(
  [getPublishedTopics],
  (_topics) => {
    console.log('_topics', _topics);

    return _topics
    .map(_topic => ({
      label: _topic.name,
      route: 'topics_detail',
      params: { id: _topic.slug }
    }));
  }
);

export default { parseTopics };

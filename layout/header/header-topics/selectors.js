import { createSelector } from 'reselect';

const getTopics = state => state.topics.topics;

export const getPublishedTopics = createSelector(
  [getTopics],
  _topics => _topics.filter(_topic => _topic.published)
    .map(_topic => ({
      label: _topic.name,
      route: 'topics_detail',
      params: { id: _topic.slug }
    }))
);

export default { getPublishedTopics };

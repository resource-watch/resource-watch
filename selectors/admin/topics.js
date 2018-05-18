import { createSelector } from 'reselect';

const topics = state => state.topics.topics;
const filters = state => state.topics.filters;

/**
 * Return the topics that comply with the filters
 * @param {object[]} topics Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the topics
 */
const getFilteredTopics = (topics, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) return topics;

  return topics.filter((topic) => { // eslint-disable-line arrow-body-style
    return filters.every((filter) => {
      if (filter.key === 'id') return topic.id === filter.value;
      if (!topic[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return topic[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return topic[filter.key] === filter.value;
    });
  });
};

export default createSelector(topics, filters, getFilteredTopics);

import { createSelector } from 'reselect';

// utils
import { filterFunction } from 'utils/topics';

const getAlltopics = state => state.topics.all.data;
const getAllfilters = state => state.topics.all.filters;
const addOwnerAndRole = topics =>
  topics.map(_topic => ({
    ..._topic,
    owner: _topic.user ? _topic.user.name || (_topic.user.email || '').split('@')[0] : '',
    role: _topic.user ? _topic.user.role || '' : ''
  }));

/**
 * Return the topics that comply with the filters
 * @param {object[]} topics topics to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the topics
 */
export const getAllFilteredTopics = createSelector([getAlltopics, getAllfilters], filterFunction);
export const getTopics =
  createSelector([getAllFilteredTopics], addOwnerAndRole);

export default { getTopics };


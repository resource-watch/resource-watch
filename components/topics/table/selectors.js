import { createSelector } from 'reselect';

// utils
import { filterFunction, addOwnerAndRole } from 'utils/topics';

const getAlltopics = state => state.topics.all.data;
const getAllfilters = state => state.topics.all.filters;

/**
 * Return the topics that comply with the filters
 * @param {object[]} topics topics to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the topics
 */
export const getAllFilteredTopics = createSelector([getAlltopics, getAllfilters], filterFunction);
export const getTopics =
  createSelector([getAllFilteredTopics], addOwnerAndRole);

export default { getTopics };


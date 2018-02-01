import { createSelector } from 'reselect';

const tools = state => state.tools.list;
const filters = state => state.tools.filters;

/**
 * Return the tools that comply with the filters
 * @param {object[]} tools Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the tools
 */
const getFilteredTools = (tools, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) return tools;

  return tools.filter((tool) => { // eslint-disable-line arrow-body-style
    return filters.every((filter) => {
      if (filter.key === 'id') return tool.id === filter.value;
      if (!tool[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return tool[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return tool[filter.key] === filter.value;
    });
  });
};

export default createSelector(tools, filters, getFilteredTools);

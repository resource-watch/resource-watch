import { createSelector } from 'reselect';

const pages = state => state.pages.pages.list;
const filters = state => state.pages.pages.filters;

/**
 * Return the pages that comply with the filters
 * @param {object[]} pages Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the pages
 */
const getFilteredPages = (pages, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) return pages;

  return pages.filter((page) => { // eslint-disable-line arrow-body-style
    return filters.every((filter) => {
      if (filter.key === 'id') return page.id === filter.value;
      if (!page[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return page[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return page[filter.key] === filter.value;
    });
  });
};

export default createSelector(pages, filters, getFilteredPages);

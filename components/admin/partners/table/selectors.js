import { createSelector } from 'reselect';

// states
const getPartners = (state) => state.partners.all.list;
const getFilters = (state) => state.partners.filters;

/**
 * Return the partners that comply with the filters
 * @param {object[]} partners list of partners to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the partners
 */
export const getFilteredPartners = createSelector(
  [getPartners, getFilters],
  (_partners, _filters) => {
    if (!_filters.length) return _partners;

    return _partners.filter((partner) => _filters.every((filter) => {
      if (filter.key === 'id') return partner.id === filter.value;
      if (!partner[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return partner[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return partner[filter.key] === filter.value;
    }));
  },
);

export default { getFilteredPartners };

import { createSelector } from 'reselect';

const partners = state => state.partners.list;
const filters = state => state.partners.filters;

/**
 * Return the partners that comply with the filters
 * @param {object[]} partners Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the partners
 */
const getFilteredPartners = (partners, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) return partners;

  return partners.filter((partner) => { // eslint-disable-line arrow-body-style
    return filters.every((filter) => {
      if (filter.key === 'id') return partner.id === filter.value;
      if (!partner[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return partner[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return partner[filter.key] === filter.value;
    });
  });
};

export default createSelector(partners, filters, getFilteredPartners);

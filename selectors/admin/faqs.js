import { createSelector } from 'reselect';

const faqs = state => state.faqs.list;
const filters = state => state.faqs.filters;

/**
 * Return the faqs that comply with the filters
 * @param {object[]} faqs Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the faqs
 */
const getFilteredFaqs = (faqs, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) return faqs;

  return faqs.filter((faq) => { // eslint-disable-line arrow-body-style
    return filters.some((filter) => {
      if (filter.key === 'id') return faq.id === filter.value;
      if (!faq[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return faq[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return faq[filter.key] === filter.value;
    });
  });
};

export default createSelector(faqs, filters, getFilteredFaqs);

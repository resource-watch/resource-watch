import sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';

const faqs = state => state.faqs.list;
const filters = state => state.faqs.filters;
const order = state => state.faqs.order;

/**
 * Return the faqs that comply with the filters
 * @param {object[]} faqs Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the faqs
 */
const getFilteredFaqs = (faqs = [], filters, order) => { // eslint-disable-line no-shadow
  const newFaqs = sortBy(faqs.map((f) => {
    const index = order.indexOf(+f.id);
    return { ...f, order: index < 0 ? f.order : index };
  }), 'order');

  if (!filters.length) return newFaqs;

  return newFaqs
    .filter((faq) => { // eslint-disable-line arrow-body-style
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

export default createSelector(faqs, filters, order, getFilteredFaqs);

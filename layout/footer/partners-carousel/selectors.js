import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';

// states
const getPartners = (state) => state.partners.published.list;

export const getFeaturedPartners = createSelector(
  [getPartners],
  (_partners) => sortBy(_partners.filter((_partner) => _partner.featured), 'name'),
);

export default {
  getFeaturedPartners,
};

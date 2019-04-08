import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';

// constants
import { FOOTER_LINKS } from './constants';

// states
const getPartners = state => state.partners.published.list;

export const getFeaturedPartners = createSelector(
  [getPartners],
  _partners => sortBy(_partners.filter(_partner => _partner.featured), 'name')
);

export const getMenu = createSelector(
  [],
  () => FOOTER_LINKS
    .filter(i => i.id !== 'search' && i.id !== 'myrw')
    .map((i) => {
      const parent = [i];
      const { children = [] } = i;
      return [...parent, ...children];
    })
);

export default {
  getFeaturedPartners,
  getMenu
};

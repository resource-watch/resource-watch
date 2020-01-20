import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';

// constants
import { FOOTER_LINKS } from './constants';

// states
const getPartners = state => state.partners.published.list;
const getFeaturedDashboards = state => state.dashboards.featured.list;

// generate dashboards footer links + add more link to featured dashboard
const setDashboardsLinks = (_dashboards) => {
  const dashLinks = _dashboards.map(_dashboard => ({
    label: _dashboard.name,
    route: 'dashboards_detail',
    params: { slug: _dashboard.slug }
  }));
  dashLinks.push({
    label: 'More',
    route: '/dashboards#featuredDashboards'
  });
  return dashLinks;
};

export const getFeaturedPartners = createSelector(
  [getPartners],
  _partners => sortBy(_partners.filter(_partner => _partner.featured), 'name')
);

export const getMenu = createSelector(
  [getFeaturedDashboards],
  _dashboards => FOOTER_LINKS
    .filter(i => i.id !== 'search' && i.id !== 'myrw')
    .map((i) => {
      const parent = [i];
      const children = i.id === 'dashboards' ?
        // replace static dashboards links to dynamic
        setDashboardsLinks(_dashboards) :
        i.children || [];
      return [...parent, ...children];
    })
);

export default {
  getFeaturedPartners,
  getMenu
};

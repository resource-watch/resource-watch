import { createSelector } from 'reselect';

const dashboards = state => state.adminDashboards.dashboards.list;
const filters = state => state.adminDashboards.dashboards.filters;

/**
 * Return the dashboards that comply with the filters
 * @param {object[]} dashboards Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the dashboards
 */
export const getFilteredDashboards = (dashboards, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) return dashboards;

  return dashboards.filter((dashboard) => { // eslint-disable-line arrow-body-style
    return filters.every((filter) => {
      if (filter.key === 'id') return dashboard.id === filter.value;
      if (!dashboard[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return dashboard[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return dashboard[filter.key] === filter.value;
    });
  });
};

export const getAllFilteredDashboards = createSelector(dashboards, filters, getFilteredDashboards);

export const getDashboards = createSelector([getAllFilteredDashboards],
  data => data.map(_dashboard => ({
    ..._dashboard,
    owner: _dashboard.user ? _dashboard.user.name || (_dashboard.user.email || '').split('@')[0] : '',
    role: _dashboard.user ? _dashboard.user.role || '' : ''
  })));

export default {
  getDashboards,
  getFilteredDashboards
};


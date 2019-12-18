import { createSelector } from 'reselect';

// states
const getFeaturedDashboards = state => state.dashboards.featured.list;

export const parseDashboards = createSelector(
  [getFeaturedDashboards], _dashboards => _dashboards
    .map(_dashboard => ({
      label: _dashboard.name,
      route: 'dashboards_detail',
      params: { slug: _dashboard.slug }
    }))
);

export default { parseDashboards };

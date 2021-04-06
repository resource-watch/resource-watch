import { createSelector } from 'reselect';

// states
const getFeaturedDashboards = (state) => state.dashboards.featured.list;

export const parseDashboards = createSelector(
  [getFeaturedDashboards], (_dashboards) => _dashboards
    .map(({ name, slug }) => ({
      label: name,
      href: `/dashboards/${slug}`,
      // route: 'dashboards_detail',
      // params: { slug: _dashboard.slug },
    })),
);

export default { parseDashboards };

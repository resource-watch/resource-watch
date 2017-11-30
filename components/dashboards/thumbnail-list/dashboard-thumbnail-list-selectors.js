import { createSelector } from 'reselect';

const getDashboards = state => state.dashboardThumbnailList.dashboards;
const getExpanded = state => state.dashboardThumbnailList.expanded;

const filterDashboards = (dashboards, expanded) => {
  if (expanded) {
    return dashboards;
  }

  return dashboards.slice(0, 5);
};

export const getFilteredDashboards = createSelector(
  [getDashboards, getExpanded],
  filterDashboards
);

export default {
  getFilteredDashboards
};

import { createSelector } from 'reselect';

const getDashboards = state => state.dashboardThumbnailList.dashboards;
const getExpanded = state => state.dashboardThumbnailList.expanded;
const getPagination = state => state.dashboardThumbnailList.pagination;

const filterDashboards = (dashboards, expanded, pagination) => {
  if (pagination && !expanded) {
    return dashboards.slice(0, 5);
  }

  return dashboards;
};

export const getFilteredDashboards = createSelector(
  [getDashboards, getExpanded, getPagination],
  filterDashboards
);

export default {
  getFilteredDashboards
};

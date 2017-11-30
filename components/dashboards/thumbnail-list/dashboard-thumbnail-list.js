import { connect } from 'react-redux';
import * as actions from './dashboard-thumbnail-list-actions';
import reducers from './dashboard-thumbnail-list-reducers';
import defaultState from './dashboard-thumbnail-list-default-state';
import { getFilteredDashboards } from './dashboard-thumbnail-list-selectors';

import DashboardThumbnailList from './dashboard-thumbnail-list-component';

// Mandatory
export {
  actions, reducers, defaultState
};

export default connect(
  state => ({
    dashboards: getFilteredDashboards(state),
    total: state.dashboardThumbnailList.total,
    pagination: state.dashboardThumbnailList.pagination,
    selected: state.dashboardThumbnailList.selected,
    expanded: state.dashboardThumbnailList.expanded
  }),
  actions
)(DashboardThumbnailList);

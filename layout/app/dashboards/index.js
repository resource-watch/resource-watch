import { connect } from 'react-redux';

import DashboardsLayout from './component';

export default connect(
  state => ({
    data: state.staticPages.dashboards,
    dashHighlighted: state.dashboards.highlighted.list,
    dashFeatured: state.dashboards.featured.list
  }),
  null
)(DashboardsLayout);

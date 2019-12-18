import { connect } from 'react-redux';

import TopicsLayout from './component';

export default connect(
  state => ({
    data: state.staticPages.topics,
    dashboards: state.dashboards.published.list,
    dashFeatured: state.dashboards.featured.list
  }),
  null
)(TopicsLayout);

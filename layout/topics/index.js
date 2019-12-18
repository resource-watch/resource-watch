import { connect } from 'react-redux';

import TopicsLayout from './component';

export default connect(
  state => ({
    data: state.staticPages.topics,
    dashHighlighted: state.dashboards.highlighted.list,
    dashFeatured: state.dashboards.featured.list
  }),
  null
)(TopicsLayout);

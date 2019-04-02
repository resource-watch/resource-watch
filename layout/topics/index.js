import { connect } from 'react-redux';

import TopicsLayout from './component';

export default connect(
  state => ({ data: state.staticPages.dashboards }),
  null
)(TopicsLayout);

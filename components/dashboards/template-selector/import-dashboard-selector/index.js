import { connect } from 'react-redux';

import importSelector from './component';

export default connect(
  state => ({
    user: state.user,
    dashboards: state.dashboards.published.list
  }),
  null
)(importSelector);

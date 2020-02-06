import { connect } from 'react-redux';
import { getFeaturedDashboards } from 'modules/dashboards/actions';
import importSelector from './component';

export default connect(
  state => ({
    user: state.user,
    dashboards: state.dashboards.featured.list
  }),
  { getFeaturedDashboards }
)(importSelector);

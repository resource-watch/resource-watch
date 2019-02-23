import { connect } from 'react-redux';

// component
import LayoutDashboards from './component';

export default connect(
  state => ({ dashboards: state.dashboards.published.list }),
  null
)(LayoutDashboards);

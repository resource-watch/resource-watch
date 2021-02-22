import { connect } from 'react-redux';

// selectors
import { parseDashboards } from './selectors';

// component
import HeaderDashboards from './component';

export default connect(
  (state) => ({
    dashboards: parseDashboards(state),
  }),
  null,
)(HeaderDashboards);

import { connect } from 'react-redux';

// actions
import { setDropdownOpened } from '../actions';

// selectors
import { parseDashboards } from './selectors';

// component
import HeaderDashboardsComponent from './component';

export default connect(
  state => ({
    header: state.header,
    dashboards: parseDashboards(state)
  }),
  { setDropdownOpened }
)(HeaderDashboardsComponent);

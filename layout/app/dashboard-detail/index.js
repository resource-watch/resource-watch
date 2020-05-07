import { connect } from 'react-redux';

// selectors
import { getDatasetIds } from './selectors';

// component
import LayoutDashboardDetail from './component';

export default connect(
  state => ({
    ...state.dashboards.detail,
    datasetIds: getDatasetIds(state),
    query: state.routes.query
  }),
  null
)(LayoutDashboardDetail);

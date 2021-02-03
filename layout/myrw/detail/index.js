import { connect } from 'react-redux';

// selectors
import areaAlerts from 'selectors/user/areaAlerts';

// component
import LayoutMyRWDetail from './component';

export default connect(
  (state) => ({
    user: state.user,
    query: state.routes.query,
    locale: state.common.locale,
    myrwdetail: state.myrwdetail,
    alerts: areaAlerts(state),
  }),
)(LayoutMyRWDetail);

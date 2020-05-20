import { connect } from 'react-redux';
import DashboardWidgetCardComponent from './component';

export default connect(
    state => ({ user: state.user }),
    null
  )(DashboardWidgetCardComponent);

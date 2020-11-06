import { connect } from 'react-redux';

// component
import WidgetDetailHeader from './component';

export default connect(
  (state) => ({ user: state.user }),
  null,
)(WidgetDetailHeader);

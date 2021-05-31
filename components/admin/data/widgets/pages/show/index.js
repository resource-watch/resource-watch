import { connect } from 'react-redux';

// component
import WidgetsShow from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(WidgetsShow);
